const express = require("express");
const router = express.Router();
const busboy = require("busboy");
const pdfParse = require("pdf-parse");
const User = require("../models/User");
const cloudinary = require("../middleware/cloudinary");
const axios = require("axios");


// ATS Class
class ATS {
  constructor() { 
    this.professionalKeywords = {
      highPriority: [
        // IT: Programming Languages & Frameworks
        "javascript", "react", "node.js", "python", "java", "typescript", "c#", "c++", "ruby", "php",
        "kotlin", "swift", "go", "rust", "scala", "angular", "vue.js", "django", "flask", "spring",
        "laravel", "express.js", "asp.net",
    
        // IT: Cloud & Infrastructure
        "aws", "azure", "google cloud", "docker", "kubernetes", "terraform", "ansible", "jenkins",
        "microservices", "serverless",
    
        // IT: Databases & Data Science
        "sql", "mongodb", "postgresql", "mysql", "nosql", "machine learning", "tensorflow", "pytorch",
        "pandas", "numpy", "big data", "hadoop", "spark",
    
        // Mechanical Engineering
        "cad", "solidworks", "autocad", "catia", "ansys", "matlab", "finite element analysis", "fea",
        "cfd", "computational fluid dynamics", "thermodynamics", "mechanical design", "manufacturing",
        "robotics", "3d modeling", "prototyping", "materials science", "mechatronics", "plc",
        "cnc", "hvacc", "stress analysis", "machine design", "automotive engineering",
    
        // Non-IT: Finance & Business
        "financial modeling", "accounting", "excel", "quickbooks", "sap", "erp", "budgeting",
        "forecasting", "cpa", "taxation", "risk management", "investment analysis",
    
        // Non-IT: Marketing
        "seo", "sem", "digital marketing", "content marketing", "google analytics", "social media",
        "branding", "ppc", "campaign management", "market research",
    
        // Non-IT: HR
        "recruitment", "talent acquisition", "onboarding", "payroll", "hris", "employee relations",
        "performance management", "training development"
      ],
      mediumPriority: [
        // IT: Development Tools & Methodologies
        "git", "github", "rest", "api", "graphql", "html", "css", "sass", "bootstrap", "agile",
        "scrum", "devops", "testing", "selenium", "linux", "bash", "networking", "virtualization",
        // IT: UI/UX & Enterprise Tools
        "ui/ux", "figma", "sketch", "salesforce", "jira", "confluence", "sharepoint",
        // Mechanical Engineering
        "lean manufacturing", "six sigma", "quality control", "gd&t", "geometric dimensioning",
        "welding", "machining", "hydraulics", "pneumatics", "assembly", "supply chain",
        "industrial engineering", "process optimization", "maintenance engineering",
        // Non-IT: Finance & Business
        "data analysis", "pivot tables", "vba", "business intelligence", "crm", "stakeholder management",
        "cost analysis", "auditing",
        // Non-IT: Marketing
        "copywriting", "email marketing", "adobe creative suite", "photoshop", "illustrator",
        "content strategy", "influencer marketing", "analytics",
        // Non-IT: HR
        "workforce planning", "compliance", "labor law", "diversity inclusion", "conflict resolution",
        "benefits administration", "succession planning"
      ],
      general: [
        // Universal Soft Skills & Terms
        "team", "collaboration", "communication", "problem-solving", "leadership", "management",
        "project", "development", "strategy", "planning", "execution", "critical thinking",
        "adaptability", "time management", "innovation", "research", "documentation",
    
        // IT/Mechanical/Non-IT Shared Technical Terms
        "design", "optimization", "performance", "scalability", "reliability", "automation",
        "monitoring", "troubleshooting", "quality assurance", "qa", "safety", "training",
        "process improvement", "customer service", "reporting", "presentation", "negotiation"
      ]
    };
    this.minLength = 500;
    this.maxLength = 4000; 
    this.optimalDensity = { min: 0.05, max: 0.15 };
  }

  extractKeywords(text) { 
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3);
  }

  scoreResume(resumeText) {
    const resumeWords = this.extractKeywords(resumeText);
    let scoreDetails = {
      structure: 0,
      keywords: 0,
      experience: 0,
      formatting: 0,
      completeness: 0,
      readability: 0,
    };
    const feedback = [];

    // Structure (30 points)
    const sections = this.detectSections(resumeText);
    scoreDetails.structure = sections.skills * 10 + sections.experience * 15 + sections.education * 5;
    if (!sections.skills) feedback.push("Add a distinct 'Skills' section.");
    if (!sections.experience) feedback.push("Include an 'Experience' section with clear job history.");

    // Keywords (30 points)
    const keywordMatches = this.matchKeywords(resumeWords);
    scoreDetails.keywords = Math.min(
      keywordMatches.high * 2 + keywordMatches.medium * 1 + keywordMatches.general * 0.5,
      30
    );

    // Experience (20 points)
    const experienceYears = this.detectExperience(resumeText);
    scoreDetails.experience = Math.min(experienceYears * 2, 20);
    if (experienceYears === 0) feedback.push("Specify years of experience (e.g., '3+ years').");

    // Formatting (10 points)
    const formattingScore = this.checkFormatting(resumeText, resumeWords);
    scoreDetails.formatting = formattingScore.score;
    feedback.push(...formattingScore.feedback);

    // Completeness (10 points)
    const completenessScore = this.checkCompleteness(resumeText);
    scoreDetails.completeness = completenessScore.score;
    feedback.push(...completenessScore.feedback);

    // Readability (10 points)
    scoreDetails.readability = this.calculateReadability(resumeText);

    // Total Score
    const totalScore = Object.values(scoreDetails).reduce((sum, val) => sum + val, 0);
    const matchPercentage = Math.min(Math.max((totalScore / 100) * 100, 0), 100).toFixed(2);

    return {
      score: totalScore,
      matchPercentage,
      details: scoreDetails,
      matchedKeywords: keywordMatches.all,
      feedback,
    };
  }

  detectSections(text) {
    const lowerText = text.toLowerCase();
    return {
      skills: !!lowerText.match(/skills\s*[:|-]\s*([\s\S]*?)(experience|education|$)/i),
      experience: !!lowerText.match(/experience\s*[:|-]\s*([\s\S]*?)(education|skills|$)/i),
      education: !!lowerText.match(/education\s*[:|-]\s*([\s\S]*?)(experience|skills|$)/i),
    };
  }
  matchKeywords(words) {
    const matches = { high: 0, medium: 0, general: 0, all: [] };
    words.forEach((word) => {
      if (this.professionalKeywords.highPriority.includes(word)) {
        matches.high++;
        matches.all.push(word);
      } else if (this.professionalKeywords.mediumPriority.includes(word)) {
        matches.medium++;
        matches.all.push(word);
      } else if (this.professionalKeywords.general.includes(word)) {
        matches.general++;
        matches.all.push(word);
      }
    });
    return matches;
  }

  detectExperience(text) {
    const matches = text.match(/(\d+)\+?\s*(years|yrs)/gi) || [];
    return matches.reduce((sum, match) => sum + parseInt(match), 0);
  }

  checkFormatting(text, words) {
    const textLength = text.length;
    const density = words.length / textLength;
    let score = 10;
    const feedback = [];
    
    if (textLength < this.minLength) {
      score -= 5;
      feedback.push("Resume is too short; add more details.");
    } else if (textLength > this.maxLength) {
      score -= 5;
      feedback.push("Resume is too long; aim for concise content.");
    }
    if (density < this.optimalDensity.min || density > this.optimalDensity.max) {
      score -= 5;
      feedback.push("Adjust formatting for better keyword density.");
    }
    return { score, feedback };
  }

  checkCompleteness(text) {
    let score = 0;
    const feedback = [];
    if (/[\w\.-]+@[\w\.-]+|\d{3}-\d{3}-\d{4}/.test(text)) score += 5;
    else feedback.push("Add contact info (email or phone).");
    if (text.toLowerCase().includes("github") || text.toLowerCase().includes("linkedin")) score += 5;
    else feedback.push("Consider adding GitHub or LinkedIn links.");
    return { score, feedback };
  }

  calculateReadability(text) {
    // Simplified Flesch-Kincaid readability (approximation)
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const syllables = text.match(/[aeiouy]+/gi)?.length || 0;
    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return Math.min(Math.max(Math.round(score / 10), 0), 10); // Normalize to 0-10
  }
}

router.post("/resume-upload", (req, res) => {
  const bb = busboy({ headers: req.headers });
  let userId;
  bb.on("field", (name, val) => (name === "userId" ? (userId = val) : null));
  bb.on("file", (fieldname, file, info) => {
    if (info.mimeType !== "application/pdf") {
      return res.status(400).json({ error: "Only PDFs are allowed" });
    }
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "resumes", public_id: `resume_${userId}_${Date.now()}` },
      async (error, result) => {
        if (error) return res.status(500).json({ error: "Upload failed", details: error.message });
        try {
          const updatedUser = await User.findByIdAndUpdate(
            userId,
            { pdfUrl: result.secure_url },
            { new: true }
          );
          if (!updatedUser) return res.status(404).json({ error: "User not found" });
          res.json({ message: "Resume uploaded", pdfUrl: result.secure_url });
        } catch (dbError) {
          res.status(500).json({ error: "Database error", details: dbError.message });
        }
      } 
    );
    file.pipe(uploadStream);
  });
  bb.on("finish", () => !userId && res.status(400).json({ error: "No file uploaded" }));
  req.pipe(bb);
});

// Analyze Resume Route
router.post("/score-uploaded-resume", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const user = await User.findById(userId);
    if (!user || !user.pdfUrl) return res.status(404).json({ error: "User or resume not found" });

    const response = await axios.get(user.pdfUrl, { responseType: "arraybuffer", timeout: 10000 });
    const resumeText = await pdfParse(response.data).then((data) => data.text);

    const ats = new ATS();
    const result = ats.scoreResume(resumeText);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Analysis failed", details: error.message });
  }
});

module.exports = router;