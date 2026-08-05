const MedVertical = require("../models/MedVertical");
const MedTeam = require("../models/CreateMedTeam");
const BDA = require("../models/CreateBDA");
const MedEnroll = require("../models/MedEnroll");

// Create Vertical
exports.createVertical = async (req, res) => {
  try {
    const { name, managerId, targetValue, domains } = req.body;

    if (!name || !managerId || !targetValue || !domains || domains.length === 0) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if any domain is already assigned to an existing vertical
    const existingVerticals = await MedVertical.find({ domains: { $in: domains } });
    if (existingVerticals.length > 0) {
      return res.status(400).json({ 
        error: "One or more selected courses are already assigned to another vertical." 
      });
    }

    const newVertical = new MedVertical({ name, managerId, targetValue, domains });
    await newVertical.save();

    res.status(201).json({ message: "Vertical created successfully", vertical: newVertical });
  } catch (error) {
    console.error("Error in createVertical:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Get all verticals with achieved counts
exports.getVerticals = async (req, res) => {
  try {
    let { month, year } = req.query;

    const verticals = await MedVertical.find()
      .populate("managerId", "fullname team teams")
      .populate("domains", "title");
      // Calculate achieved counts dynamically
    const verticalsWithCount = await Promise.all(verticals.map(async (vertical) => {
      let achievedCount = 0;
      if (vertical.domains && vertical.domains.length > 0) {
         const domainIds = vertical.domains.filter(d => d != null).map(d => d._id || d);
         let query = { domainId: { $in: domainIds } };
         
         if (month !== "all") {
           if (!month || !year) {
             const now = new Date();
             month = now.getMonth() + 1;
             year = now.getFullYear();
           }
           const start = new Date(year, month - 1, 1);
           const end = new Date(year, month, 0, 23, 59, 59, 999);
           query.createdAt = { $gte: start, $lte: end };
         }
         
         achievedCount = await MedEnroll.countDocuments(query);
      }

      return {
        ...vertical.toObject(),
        achievedCount
      };
    }));

    res.status(200).json(verticalsWithCount);
  } catch (error) {
    console.error("Error in getVerticals:", error);
    res.status(500).json({ error: "Internal server error", details: error.message, stack: error.stack });
  }
};

// Get verticals by manager
exports.getVerticalsByManager = async (req, res) => {
  try {
    const { managerId } = req.params;
    let { month, year } = req.query;

    const verticals = await MedVertical.find({ managerId }).populate("domains", "title");
    
    // Calculate achieved counts dynamically
    const verticalsWithCount = await Promise.all(verticals.map(async (vertical) => {
      let achievedCount = 0;
      let domainCounts = [];
      let enrollments = [];
      
      if (vertical.domains && vertical.domains.length > 0) {
         const domainIds = vertical.domains.filter(d => d != null).map(d => d._id || d);
         let query = { domainId: { $in: domainIds } };
         
         if (month !== "all") {
           if (!month || !year) {
             const now = new Date();
             month = now.getMonth() + 1;
             year = now.getFullYear();
           }
           const start = new Date(year, month - 1, 1);
           const end = new Date(year, month, 0, 23, 59, 59, 999);
           query.createdAt = { $gte: start, $lte: end };
         }

         // Optimized using MongoDB Aggregation
         const aggregation = await MedEnroll.aggregate([
           { $match: query },
           {
             $group: {
               _id: { domainId: "$domainId", counselor: "$counselor", domain: "$domain" },
               count: { $sum: 1 }
             }
           }
         ]);

         achievedCount = aggregation.reduce((acc, curr) => acc + curr.count, 0);
         
         domainCounts = vertical.domains.map(d => {
            const dIdStr = d._id.toString();
            const dTitle = d.title || d.programName || "Unknown";
            
            // find aggregated enrollments for this domain
            const domainAgg = aggregation.filter(item => 
                (item._id.domainId && item._id.domainId.toString() === dIdStr) || 
                (item._id.domain === dTitle)
            );
            
            const domainTotalCount = domainAgg.reduce((acc, curr) => acc + curr.count, 0);
            
            // count counselors
            const counselorCounts = {};
            domainAgg.forEach(item => {
                if (item._id.counselor && item._id.counselor.trim() !== "") {
                    counselorCounts[item._id.counselor] = (counselorCounts[item._id.counselor] || 0) + item.count;
                }
            });
            
            // find best counselor
            let bestCounselor = null;
            let maxCount = 0;
            Object.entries(counselorCounts).forEach(([counselor, count]) => {
                if (count > maxCount) {
                    maxCount = count;
                    bestCounselor = counselor;
                }
            });

            return {
              domainId: d._id,
              title: dTitle,
              count: domainTotalCount,
              bestCounselor: bestCounselor ? { name: bestCounselor, count: maxCount } : null
            };
          });
      }

      return {
        ...vertical.toObject(),
        achievedCount,
        domainCounts
      };
    }));

    res.status(200).json(verticalsWithCount);
  } catch (error) {
    console.error("Error in getVerticalsByManager:", error);
    res.status(500).json({ error: "Internal server error", details: error.message, stack: error.stack });
  }
};

// Update Vertical
exports.updateVertical = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, managerId, targetValue, domains } = req.body;

    if (!name || !managerId || !targetValue || !domains || domains.length === 0) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if any domain is already assigned to ANOTHER existing vertical
    const existingVerticals = await MedVertical.find({ _id: { $ne: id }, domains: { $in: domains } });
    if (existingVerticals.length > 0) {
      return res.status(400).json({ 
        error: "One or more selected courses are already assigned to another vertical." 
      });
    }

    const updatedVertical = await MedVertical.findByIdAndUpdate(
      id,
      { name, managerId, targetValue, domains },
      { new: true }
    );

    if (!updatedVertical) {
      return res.status(404).json({ error: "Vertical not found." });
    }

    res.status(200).json({ message: "Vertical updated successfully", vertical: updatedVertical });
  } catch (error) {
    console.error("Error in updateVertical:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Delete a vertical
exports.deleteVertical = async (req, res) => {
  try {
    const { id } = req.params;
    await MedVertical.findByIdAndDelete(id);
    res.status(200).json({ message: "Vertical deleted successfully" });
  } catch (error) {
    console.error("Error deleting vertical:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get paginated enrollments for a vertical
exports.getVerticalEnrollments = async (req, res) => {
  try {
    const { verticalId } = req.params;
    let { page = 1, limit = 50, month, year, domainFilter, counselorFilter } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const vertical = await MedVertical.findById(verticalId);
    if (!vertical) {
      return res.status(404).json({ error: "Vertical not found" });
    }

    let query = {};
    let domainIds = [];
    if (vertical.domains && vertical.domains.length > 0) {
      domainIds = vertical.domains.map(d => d._id || d);
      query = { domainId: { $in: domainIds } };
    } else {
      return res.status(200).json({ enrollments: [], totalPages: 0, currentPage: page });
    }

    if (month !== "all") {
      if (!month || !year) {
        const now = new Date();
        month = now.getMonth() + 1;
        year = now.getFullYear();
      }
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }

    if (domainFilter) {
      query.domain = { $regex: domainFilter, $options: "i" };
    }
    
    if (counselorFilter) {
      query.counselor = { $regex: counselorFilter, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const totalEnrollments = await MedEnroll.countDocuments(query);
    const enrollments = await MedEnroll.find(query)
      .select("fullname collegeName domain yearOfStudy createdAt domainId counselor programPrice")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Fetch unique counselors for the CURRENT filters (excluding counselor filter itself)
    const counselorQuery = { ...query };
    delete counselorQuery.counselor;
    const availableCounselors = await MedEnroll.distinct("counselor", counselorQuery);
    const filteredCounselors = availableCounselors.filter(c => c && c.trim() !== "").sort();

    res.status(200).json({
      enrollments,
      availableCounselors: filteredCounselors,
      totalPages: Math.ceil(totalEnrollments / limit),
      currentPage: page,
      totalEnrollments
    });
  } catch (error) {
    console.error("Error in getVerticalEnrollments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
