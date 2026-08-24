const PracticePath = require('../models/PracticePath');
const PracticeTopic = require('../models/PracticeTopic');
const PracticeSubtopic = require('../models/PracticeSubtopic');
const PracticeQuestion = require('../models/PracticeQuestion');
const UserQuestionProgress = require('../models/UserQuestionProgress');
const mongoose = require('mongoose');

// ─────────────────────────────────────────────
// HELPER: aggregate total published question count for a set of path IDs
// ─────────────────────────────────────────────
const getTotalProblemsMap = async (pathIds) => {
  const result = await PracticeQuestion.aggregate([
    { $match: { practicePath: { $in: pathIds }, isPublished: true } },
    { $group: { _id: '$practicePath', count: { $sum: 1 } } },
  ]);
  const map = {};
  result.forEach((r) => {
    map[r._id.toString()] = r.count;
  });
  return map;
};

// ─────────────────────────────────────────────
// GET /api/practice
// List all published practice paths with auto-calculated totalProblems
// ─────────────────────────────────────────────
const listPaths = async (req, res) => {
  try {
    const paths = await PracticePath.find({ isPublished: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    const pathIds = paths.map((p) => p._id);
    const problemsMap = await getTotalProblemsMap(pathIds);

    const pathsWithCount = paths.map((p) => ({
      ...p,
      totalProblems: problemsMap[p._id.toString()] || 0,
    }));

    res.json({ paths: pathsWithCount });
  } catch (err) {
    console.error('listPaths error:', err);
    res.status(500).json({ message: 'Failed to fetch practice paths.' });
  }
};

// ─────────────────────────────────────────────
// GET /api/practice/:pathSlug
// Single path detail with topics, subtopics, and question counts
// ─────────────────────────────────────────────
const getPath = async (req, res) => {
  try {
    const { pathSlug } = req.params;
    const path = await PracticePath.findOne({ slug: pathSlug, isPublished: true }).lean();
    if (!path) return res.status(404).json({ message: 'Practice path not found.' });

    const totalProblems =
      (await getTotalProblemsMap([path._id]))[path._id.toString()] || 0;

    // Fetch topics
    const topics = await PracticeTopic.find({ practicePath: path._id, isPublished: true })
      .sort({ order: 1 })
      .lean();

    const topicIds = topics.map((t) => t._id);

    // Fetch subtopics grouped by topic
    const subtopics = await PracticeSubtopic.find({
      topic: { $in: topicIds },
      isPublished: true,
    })
      .sort({ order: 1 })
      .lean();

    const userId = req.practiceUser?.id;

    // Question counts per subtopic
    const subtopicIds = subtopics.map((s) => s._id);
    const qCounts = await PracticeQuestion.aggregate([
      { $match: { subtopic: { $in: subtopicIds }, isPublished: true } },
      { $group: { _id: '$subtopic', count: { $sum: 1 } } },
    ]);
    const qCountMap = {};
    qCounts.forEach((q) => {
      qCountMap[q._id.toString()] = q.count;
    });

    // Subtopic progress
    const subtopicProgressMap = {};
    if (userId) {
      const progressCounts = await UserQuestionProgress.aggregate([
        { 
          $match: { 
            user: new mongoose.Types.ObjectId(userId),
            practicePath: path._id
          }
        },
        {
          $group: {
            _id: '$subtopic',
            solvedCount: { $sum: { $cond: [{ $eq: ['$status', 'solved'] }, 1, 0] } },
            attemptedCount: { $sum: { $cond: [{ $eq: ['$status', 'attempted'] }, 1, 0] } }
          }
        }
      ]);
      progressCounts.forEach(p => {
        subtopicProgressMap[p._id.toString()] = p;
      });
    }

    // Build tree
    const subtopicsByTopic = {};
    subtopics.forEach((s) => {
      const key = s.topic.toString();
      const stId = s._id.toString();
      const totalQ = qCountMap[stId] || 0;
      const prog = subtopicProgressMap[stId] || { solvedCount: 0, attemptedCount: 0 };
      
      let status = 'not_started';
      if (totalQ > 0 && prog.solvedCount === totalQ) {
        status = 'completed';
      } else if (prog.solvedCount > 0 || prog.attemptedCount > 0) {
        status = 'in_progress';
      }

      if (!subtopicsByTopic[key]) subtopicsByTopic[key] = [];
      subtopicsByTopic[key].push({
        ...s,
        questionCount: totalQ,
        status,
      });
    });

    const topicsWithSubs = topics.map((t) => ({
      ...t,
      subtopics: subtopicsByTopic[t._id.toString()] || [],
    }));

    res.json({
      path: { ...path, totalProblems },
      topics: topicsWithSubs,
    });
  } catch (err) {
    console.error('getPath error:', err);
    res.status(500).json({ message: 'Failed to fetch practice path.' });
  }
};

// ─────────────────────────────────────────────
// GET /api/practice/:pathSlug/:topicSlug/:subtopicSlug/questions
// List questions for a subtopic (auth required)
// ─────────────────────────────────────────────
const getSubtopicQuestions = async (req, res) => {
  try {
    const { pathSlug, topicSlug, subtopicSlug } = req.params;
    const userId = req.practiceUser?.id;

    const path = await PracticePath.findOne({ slug: pathSlug, isPublished: true }).lean();
    if (!path) return res.status(404).json({ message: 'Practice path not found.' });

    const topic = await PracticeTopic.findOne({
      practicePath: path._id,
      slug: topicSlug,
      isPublished: true,
    }).lean();
    if (!topic) return res.status(404).json({ message: 'Topic not found.' });

    const subtopic = await PracticeSubtopic.findOne({
      topic: topic._id,
      slug: subtopicSlug,
      isPublished: true,
    }).lean();
    if (!subtopic) return res.status(404).json({ message: 'Subtopic not found.' });

    // Questions (without options/explanation for listing)
    const questions = await PracticeQuestion.find({
      subtopic: subtopic._id,
      isPublished: true,
    })
      .sort({ order: 1 })
      .select('-options -explanation -codeSnippet')
      .lean();

    // User progress for these questions
    let progressMap = {};
    if (userId) {
      const questionIds = questions.map((q) => q._id);
      const progressRecords = await UserQuestionProgress.find({
        user: new mongoose.Types.ObjectId(userId),
        question: { $in: questionIds },
      })
        .select('question status isCorrect attempts')
        .lean();

      progressRecords.forEach((p) => {
        progressMap[p.question.toString()] = p;
      });
    }

    const questionsWithStatus = questions.map((q) => {
      const prog = progressMap[q._id.toString()];
      return {
        ...q,
        status: prog?.status || 'not_started',
        isCorrect: prog?.isCorrect || false,
        attempts: prog?.attempts || 0,
      };
    });

    res.json({
      path: { _id: path._id, title: path.title, slug: path.slug },
      topic: { _id: topic._id, title: topic.title, slug: topic.slug },
      subtopic: { _id: subtopic._id, title: subtopic.title, slug: subtopic.slug },
      questions: questionsWithStatus,
    });
  } catch (err) {
    console.error('getSubtopicQuestions error:', err);
    res.status(500).json({ message: 'Failed to fetch questions.' });
  }
};

// ─────────────────────────────────────────────
// GET /api/practice/question/:questionSlug
// Single question detail page (auth required)
// Options' isCorrect is hidden from client until after submission
// ─────────────────────────────────────────────
const getQuestion = async (req, res) => {
  try {
    const { questionSlug } = req.params;
    const userId = req.practiceUser?.id;

    const question = await PracticeQuestion.findOne({
      slug: questionSlug,
      isPublished: true,
    })
      .populate('practicePath', 'title slug themeColor gradientFrom gradientTo')
      .populate('topic', 'title slug')
      .populate('subtopic', 'title slug')
      .lean();

    if (!question) return res.status(404).json({ message: 'Question not found.' });

    // Hide isCorrect from options before submission
    let progress = null;
    if (userId) {
      progress = await UserQuestionProgress.findOne({
        user: new mongoose.Types.ObjectId(userId),
        question: question._id,
      }).lean();
    }

    const isSolved = progress && progress.status === 'solved';

    const safeOptions = question.options.map((opt, idx) => ({
      _id: opt._id,
      text: opt.text,
      // Only reveal isCorrect after user has solved it
      ...(isSolved ? { isCorrect: opt.isCorrect } : {}),
    }));

    // Get adjacent questions for prev/next navigation
    const allQuestionsInSubtopic = await PracticeQuestion.find({
      subtopic: question.subtopic._id,
      isPublished: true,
    })
      .sort({ order: 1 })
      .select('_id slug title')
      .lean();

    const currentIdx = allQuestionsInSubtopic.findIndex(
      (q) => q._id.toString() === question._id.toString()
    );
    const prevQuestion = currentIdx > 0 ? allQuestionsInSubtopic[currentIdx - 1] : null;
    const nextQuestion =
      currentIdx < allQuestionsInSubtopic.length - 1
        ? allQuestionsInSubtopic[currentIdx + 1]
        : null;

    res.json({
      question: {
        ...question,
        options: safeOptions,
        explanation: isSolved ? question.explanation : undefined,
      },
      progress: progress || { status: 'not_started', selectedOptionIndex: null, isCorrect: false, attempts: 0 },
      hasSubmitted: isSolved,
      navigation: {
        prev: prevQuestion,
        next: nextQuestion,
        currentIndex: currentIdx + 1,
        total: allQuestionsInSubtopic.length,
      },
    });
  } catch (err) {
    console.error('getQuestion error:', err);
    res.status(500).json({ message: 'Failed to fetch question.' });
  }
};

// ─────────────────────────────────────────────
// POST /api/practice/question/:questionId/submit
// Submit answer (auth required)
// ─────────────────────────────────────────────
const submitAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { selectedOptionIndex } = req.body;
    const userId = req.practiceUser.id;

    if (selectedOptionIndex === undefined || selectedOptionIndex === null) {
      return res.status(400).json({ message: 'Please select an option before submitting.' });
    }

    const question = await PracticeQuestion.findOne({
      _id: questionId,
      isPublished: true,
    }).lean();

    if (!question) return res.status(404).json({ message: 'Question not found.' });

    if (question.type !== 'mcq') {
      return res.status(400).json({ message: 'Only MCQ submissions are supported.' });
    }

    const selectedOption = question.options[selectedOptionIndex];
    if (!selectedOption) {
      return res.status(400).json({ message: 'Invalid option selected.' });
    }

    const isCorrect = selectedOption.isCorrect === true;

    // Upsert progress — once solved, don't downgrade status
    const existingProgress = await UserQuestionProgress.findOne({
      user: new mongoose.Types.ObjectId(userId),
      question: question._id,
    });

    let newStatus;
    if (existingProgress?.status === 'solved') {
      newStatus = 'solved'; // once solved, stays solved
    } else {
      newStatus = isCorrect ? 'solved' : 'attempted';
    }

    const progress = await UserQuestionProgress.findOneAndUpdate(
      { user: new mongoose.Types.ObjectId(userId), question: question._id },
      {
        $set: {
          selectedOptionIndex,
          status: newStatus,
          isCorrect: existingProgress?.status === 'solved' ? true : isCorrect,
          lastAttemptedAt: new Date(),
          ...(isCorrect && !existingProgress?.completedAt ? { completedAt: new Date() } : {}),
          practicePath: question.practicePath,
          topic: question.topic,
          subtopic: question.subtopic,
        },
        $inc: { attempts: 1 },
      },
      { upsert: true, new: true }
    );

    // Update question aggregate counters
    const updateCounters = {
      $inc: { attemptCount: 1 },
    };
    if (isCorrect && existingProgress?.status !== 'solved') {
      updateCounters.$inc.solveCount = 1;
    }
    await PracticeQuestion.findByIdAndUpdate(question._id, updateCounters);

    // Return full question details with revealed correct answer if solved
    const optionsWithAnswer = question.options.map((opt, idx) => ({
      _id: opt._id,
      text: opt.text,
      ...(newStatus === 'solved' ? { isCorrect: opt.isCorrect } : {}),
    }));

    res.json({
      message: isCorrect ? 'Correct! Well done!' : 'Incorrect. Keep practicing!',
      isCorrect,
      correctOptionIndex: newStatus === 'solved' ? question.options.findIndex((o) => o.isCorrect) : undefined,
      explanation: newStatus === 'solved' ? question.explanation : undefined,
      options: optionsWithAnswer,
      progress: {
        status: progress.status,
        attempts: progress.attempts,
        selectedOptionIndex: progress.selectedOptionIndex,
      },
    });
  } catch (err) {
    console.error('submitAnswer error:', err);
    res.status(500).json({ message: 'Failed to submit answer.' });
  }
};

// ─────────────────────────────────────────────
// GET /api/practice/:pathSlug/progress
// User's progress for a practice path (auth required)
// ─────────────────────────────────────────────
const getPathProgress = async (req, res) => {
  try {
    const { pathSlug } = req.params;
    const userId = req.practiceUser.id;

    const path = await PracticePath.findOne({ slug: pathSlug, isPublished: true }).lean();
    if (!path) return res.status(404).json({ message: 'Practice path not found.' });

    const [totalProblemsData, progressData] = await Promise.all([
      PracticeQuestion.countDocuments({ practicePath: path._id, isPublished: true }),
      UserQuestionProgress.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            practicePath: path._id,
          },
        },
        {
          $group: {
            _id: null,
            solved: { $sum: { $cond: [{ $eq: ['$status', 'solved'] }, 1, 0] } },
            attempted: { $sum: { $cond: [{ $eq: ['$status', 'attempted'] }, 1, 0] } },
            totalAttempts: { $sum: '$attempts' },
          },
        },
      ]),
    ]);

    const stats = progressData[0] || { solved: 0, attempted: 0, totalAttempts: 0 };
    const percentage =
      totalProblemsData > 0
        ? Math.round((stats.solved / totalProblemsData) * 100)
        : 0;

    res.json({
      pathId: path._id,
      pathTitle: path.title,
      totalProblems: totalProblemsData,
      solved: stats.solved,
      attempted: stats.attempted,
      totalAttempts: stats.totalAttempts,
      percentage,
    });
  } catch (err) {
    console.error('getPathProgress error:', err);
    res.status(500).json({ message: 'Failed to fetch progress.' });
  }
};

module.exports = {
  listPaths,
  getPath,
  getSubtopicQuestions,
  getQuestion,
  submitAnswer,
  getPathProgress,
};
