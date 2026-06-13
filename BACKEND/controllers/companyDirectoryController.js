const CompanyDirectory = require('../models/CompanyDirectory');

// @desc    Get all companies
// @route   GET /api/company-directory
// @access  Public (or authenticated user depending on requirement, usually user)
exports.getCompanies = async (req, res) => {
  try {
    const { 
      search, 
      companyType, 
      fresherFriendly, 
      internshipFriendly, 
      remoteFriendly,
      industry,
      location,
      page = 1, 
      limit = 20 
    } = req.query;

    const query = {};

    if (search) {
      query.companyName = { $regex: search, $options: 'i' };
    }
    if (companyType) {
      query.companyType = companyType;
    }
    if (fresherFriendly === 'true') {
      query.fresherFriendly = true;
    }
    if (internshipFriendly === 'true') {
      query.internshipFriendly = true;
    }
    if (remoteFriendly === 'true') {
      query.remoteFriendly = true;
    }
    if (industry) {
      query.industry = { $regex: industry, $options: 'i' };
    }
    if (location) {
      query.headquarters = { $regex: location, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const companies = await CompanyDirectory.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ companyName: 1 });

    const total = await CompanyDirectory.countDocuments(query);

    res.status(200).json({
      success: true,
      count: companies.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: companies
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create a new company
// @route   POST /api/company-directory
// @access  Admin (or internal seeding script)
exports.createCompany = async (req, res) => {
  try {
    const company = await CompanyDirectory.create(req.body);
    res.status(201).json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Seed dummy companies
// @route   POST /api/company-directory/seed
// @access  Admin/Dev
exports.seedCompanies = async (req, res) => {
  try {
    await CompanyDirectory.deleteMany();

    const dummyData = [
      {
        companyName: "TechNova Solutions",
        companyLogo: "https://via.placeholder.com/150/0000FF/808080?Text=TechNova",
        industry: "Information Technology",
        companyType: "Service",
        headquarters: "Bangalore, India",
        careersUrl: "https://example.com/careers",
        fresherFriendly: true,
        internshipFriendly: true,
        remoteFriendly: true,
        description: "A leading IT services company specializing in digital transformation.",
        tags: ["IT", "Consulting", "Cloud"]
      },
      {
        companyName: "InnoSoft Systems",
        companyLogo: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=InnoSoft",
        industry: "Software Development",
        companyType: "Product",
        headquarters: "Hyderabad, India",
        careersUrl: "https://example.com/careers",
        fresherFriendly: true,
        internshipFriendly: false,
        remoteFriendly: false,
        description: "Building scalable enterprise software products for the modern world.",
        tags: ["Enterprise", "SaaS", "B2B"]
      },
      {
        companyName: "FinTechify",
        companyLogo: "https://via.placeholder.com/150/00FF00/000000?Text=FinTechify",
        industry: "Finance",
        companyType: "Startup",
        headquarters: "Mumbai, India",
        careersUrl: "https://example.com/careers",
        fresherFriendly: false,
        internshipFriendly: true,
        remoteFriendly: true,
        description: "Disrupting the financial industry with blockchain technology.",
        tags: ["Fintech", "Blockchain", "Crypto"]
      },
      {
        companyName: "EduGrow",
        companyLogo: "https://via.placeholder.com/150/FFFF00/000000?Text=EduGrow",
        industry: "EdTech",
        companyType: "Startup",
        headquarters: "Delhi, India",
        careersUrl: "https://example.com/careers",
        fresherFriendly: true,
        internshipFriendly: true,
        remoteFriendly: true,
        description: "Providing accessible education to everyone, everywhere.",
        tags: ["EdTech", "E-learning", "Education"]
      },
      {
        companyName: "HealthPlus",
        companyLogo: "https://via.placeholder.com/150/FF00FF/FFFFFF?Text=HealthPlus",
        industry: "Healthcare",
        companyType: "Product",
        headquarters: "Pune, India",
        careersUrl: "https://example.com/careers",
        fresherFriendly: false,
        internshipFriendly: false,
        remoteFriendly: false,
        description: "Innovative healthcare solutions for modern hospitals.",
        tags: ["Healthcare", "HealthTech", "Medical"]
      }
    ];

    await CompanyDirectory.insertMany(dummyData);

    res.status(201).json({
      success: true,
      message: 'Dummy companies seeded successfully',
      data: dummyData
    });
  } catch (error) {
    console.error('Error seeding companies:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
