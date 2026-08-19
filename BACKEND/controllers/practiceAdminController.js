const PracticePath = require('../models/PracticePath');
const PracticeTopic = require('../models/PracticeTopic');
const PracticeSubtopic = require('../models/PracticeSubtopic');
const PracticeQuestion = require('../models/PracticeQuestion');
const UserQuestionProgress = require('../models/UserQuestionProgress');
const mongoose = require('mongoose');

// ─── Helpers ───────────────────────────────────
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// ─────────────────────────────────────────────
// PRACTICE PATHS
// ─────────────────────────────────────────────

const adminListPaths = async (req, res) => {
  try {
    const paths = await PracticePath.find()
      .sort({ order: 1, createdAt: 1 })
      .lean();

    // Add totalProblems for each path
    const pathIds = paths.map((p) => p._id);
    const counts = await PracticeQuestion.aggregate([
      { $match: { practicePath: { $in: pathIds } } },
      { $group: { _id: '$practicePath', total: { $sum: 1 }, published: { $sum: { $cond: ['$isPublished', 1, 0] } } } },
    ]);
    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id.toString()] = { total: c.total, published: c.published };
    });

    const result = paths.map((p) => ({
      ...p,
      totalProblems: countMap[p._id.toString()]?.total || 0,
      publishedProblems: countMap[p._id.toString()]?.published || 0,
    }));

    res.json({ paths: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch paths.' });
  }
};

const createPath = async (req, res) => {
  try {
    const { title, slug, description, level, image, icon, themeColor, gradientFrom, gradientTo, estimatedDuration, order, isPublished } = req.body;
    const finalSlug = slug || slugify(title);

    const existing = await PracticePath.findOne({ slug: finalSlug });
    if (existing) return res.status(409).json({ message: 'A path with this slug already exists.' });

    const path = await PracticePath.create({
      title,
      slug: finalSlug,
      description,
      level,
      image: image || '',
      icon: icon || '',
      themeColor: themeColor || '#6366f1',
      gradientFrom: gradientFrom || themeColor || '#6366f1',
      gradientTo: gradientTo || '#8b5cf6',
      estimatedDuration: estimatedDuration || '',
      order: order || 0,
      isPublished: isPublished || false,
      createdBy: req.practiceUser.id,
    });

    res.status(201).json({ message: 'Practice path created.', path });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create path.', error: err.message });
  }
};

const updatePath = async (req, res) => {
  try {
    const path = await PracticePath.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!path) return res.status(404).json({ message: 'Path not found.' });
    res.json({ message: 'Path updated.', path });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update path.', error: err.message });
  }
};

const deletePath = async (req, res) => {
  try {
    const path = await PracticePath.findByIdAndDelete(req.params.id);
    if (!path) return res.status(404).json({ message: 'Path not found.' });
    // Cascade delete topics, subtopics, questions
    const topics = await PracticeTopic.find({ practicePath: path._id }).select('_id');
    const topicIds = topics.map((t) => t._id);
    await PracticeSubtopic.deleteMany({ topic: { $in: topicIds } });
    await PracticeTopic.deleteMany({ practicePath: path._id });
    await PracticeQuestion.deleteMany({ practicePath: path._id });
    res.json({ message: 'Practice path and all related data deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete path.' });
  }
};

// ─────────────────────────────────────────────
// TOPICS
// ─────────────────────────────────────────────

const adminListTopics = async (req, res) => {
  try {
    const { pathId } = req.query;
    const filter = pathId ? { practicePath: pathId } : {};
    const topics = await PracticeTopic.find(filter)
      .populate('practicePath', 'title slug')
      .sort({ order: 1 })
      .lean();
    res.json({ topics });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch topics.' });
  }
};

const createTopic = async (req, res) => {
  try {
    const { practicePath, title, slug, description, order, isPublished } = req.body;
    const finalSlug = slug || slugify(title);
    const topic = await PracticeTopic.create({ practicePath, title, slug: finalSlug, description, order: order || 0, isPublished: isPublished || false });
    res.status(201).json({ message: 'Topic created.', topic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create topic.', error: err.message });
  }
};

const updateTopic = async (req, res) => {
  try {
    const topic = await PracticeTopic.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!topic) return res.status(404).json({ message: 'Topic not found.' });
    res.json({ message: 'Topic updated.', topic });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update topic.', error: err.message });
  }
};

const deleteTopic = async (req, res) => {
  try {
    const topic = await PracticeTopic.findByIdAndDelete(req.params.id);
    if (!topic) return res.status(404).json({ message: 'Topic not found.' });
    const subs = await PracticeSubtopic.find({ topic: topic._id }).select('_id');
    const subIds = subs.map((s) => s._id);
    await PracticeQuestion.deleteMany({ subtopic: { $in: subIds } });
    await PracticeSubtopic.deleteMany({ topic: topic._id });
    res.json({ message: 'Topic and related data deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete topic.' });
  }
};

// ─────────────────────────────────────────────
// SUBTOPICS
// ─────────────────────────────────────────────

const adminListSubtopics = async (req, res) => {
  try {
    const { topicId } = req.query;
    const filter = topicId ? { topic: topicId } : {};
    const subtopics = await PracticeSubtopic.find(filter)
      .populate('topic', 'title slug')
      .populate('practicePath', 'title slug')
      .sort({ order: 1 })
      .lean();
    res.json({ subtopics });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subtopics.' });
  }
};

const createSubtopic = async (req, res) => {
  try {
    const { topic, practicePath, title, slug, description, order, isPublished } = req.body;
    const finalSlug = slug || slugify(title);
    const subtopic = await PracticeSubtopic.create({ topic, practicePath, title, slug: finalSlug, description, order: order || 0, isPublished: isPublished || false });
    res.status(201).json({ message: 'Subtopic created.', subtopic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create subtopic.', error: err.message });
  }
};

const updateSubtopic = async (req, res) => {
  try {
    const subtopic = await PracticeSubtopic.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!subtopic) return res.status(404).json({ message: 'Subtopic not found.' });
    res.json({ message: 'Subtopic updated.', subtopic });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update subtopic.', error: err.message });
  }
};

const deleteSubtopic = async (req, res) => {
  try {
    const subtopic = await PracticeSubtopic.findByIdAndDelete(req.params.id);
    if (!subtopic) return res.status(404).json({ message: 'Subtopic not found.' });
    await PracticeQuestion.deleteMany({ subtopic: subtopic._id });
    res.json({ message: 'Subtopic and questions deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete subtopic.' });
  }
};

// ─────────────────────────────────────────────
// QUESTIONS
// ─────────────────────────────────────────────

const adminListQuestions = async (req, res) => {
  try {
    const { pathId, topicId, subtopicId, type, difficulty, status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (pathId) filter.practicePath = pathId;
    if (topicId) filter.topic = topicId;
    if (subtopicId) filter.subtopic = subtopicId;
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;
    if (status === 'published') filter.isPublished = true;
    if (status === 'draft') filter.isPublished = false;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [questions, total] = await Promise.all([
      PracticeQuestion.find(filter)
        .populate('practicePath', 'title')
        .populate('topic', 'title')
        .populate('subtopic', 'title')
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-options -explanation')
        .lean(),
      PracticeQuestion.countDocuments(filter),
    ]);

    res.json({ questions, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch questions.' });
  }
};

const getAdminQuestion = async (req, res) => {
  try {
    const question = await PracticeQuestion.findById(req.params.id)
      .populate('practicePath', 'title slug')
      .populate('topic', 'title slug')
      .populate('subtopic', 'title slug');
    if (!question) return res.status(404).json({ message: 'Question not found.' });
    res.json({ question });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch question.' });
  }
};

const createQuestion = async (req, res) => {
  try {
    const { practicePath, topic, subtopic, title, slug, type, difficulty, statement, codeSnippet, codeLanguage, options, explanation, tags, order, isPublished } = req.body;
    const finalSlug = slug || slugify(title);

    const existing = await PracticeQuestion.findOne({ slug: finalSlug });
    if (existing) return res.status(409).json({ message: 'A question with this slug already exists.' });

    const question = await PracticeQuestion.create({
      practicePath, topic, subtopic, title, slug: finalSlug, type, difficulty, statement,
      codeSnippet: codeSnippet || '', codeLanguage: codeLanguage || '',
      options: options || [],
      explanation: explanation || '',
      tags: tags || [],
      order: order || 0,
      isPublished: isPublished || false,
      createdBy: req.practiceUser.id,
    });

    res.status(201).json({ message: 'Question created.', question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create question.', error: err.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await PracticeQuestion.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!question) return res.status(404).json({ message: 'Question not found.' });
    res.json({ message: 'Question updated.', question });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update question.', error: err.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await PracticeQuestion.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found.' });
    await UserQuestionProgress.deleteMany({ question: question._id });
    res.json({ message: 'Question deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete question.' });
  }
};

// Admin dashboard stats
const adminStats = async (req, res) => {
  try {
    const [totalPaths, totalQuestions, publishedQuestions, totalUsers] = await Promise.all([
      PracticePath.countDocuments(),
      PracticeQuestion.countDocuments(),
      PracticeQuestion.countDocuments({ isPublished: true }),
      require('../models/PracticeUser').countDocuments(),
    ]);
    const totalAttempts = await UserQuestionProgress.countDocuments({ status: { $ne: 'not_started' } });
    const totalSolved = await UserQuestionProgress.countDocuments({ status: 'solved' });
    res.json({ totalPaths, totalQuestions, publishedQuestions, totalUsers, totalAttempts, totalSolved });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats.' });
  }
};

module.exports = {
  adminListPaths, createPath, updatePath, deletePath,
  adminListTopics, createTopic, updateTopic, deleteTopic,
  adminListSubtopics, createSubtopic, updateSubtopic, deleteSubtopic,
  adminListQuestions, getAdminQuestion, createQuestion, updateQuestion, deleteQuestion,
  adminStats,
};
