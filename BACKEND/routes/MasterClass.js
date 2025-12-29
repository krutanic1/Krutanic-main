const express = require("express");
const MasterClass = require("../models/MasterClass");
const router = express.Router();

// Create a MasterClass
router.post("/addmasterclass", async (req, res) => {
    try {
        const masterClass = new MasterClass(req.body);
        await masterClass.save();
        res.status(201).json(masterClass);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all MasterClasses
router.get("/allmasterclass", async (req, res) => {
    try {
      const masterClasses = await MasterClass.find().sort({ _id: -1 });
      res.status(200).json(masterClasses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Update a MasterClass
router.put("/masterclass/:id", async (req, res) => {
    try {
      const masterClass = await MasterClass.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!masterClass) return res.status(404).json({ error: "MasterClass not found" });
      res.status(200).json(masterClass);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  // Delete a MasterClass
router.delete("/masterclass/:id", async (req, res) => {
  try {
    const masterClass = await MasterClass.findByIdAndDelete(req.params.id);
    if (!masterClass) return res.status(404).json({ error: "MasterClass not found" });
    res.status(200).json({ message: "MasterClass deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// fetch masterclass with lemgth of application
router.get("/allmasterclasswithsapplicant", async (req, res) => {
  try {
    const masterClasses = await MasterClass.find({}, { 
      title: 1, 
      start: 1, 
      end: 1, 
      link: 1, 
      image: 1,
      status: 1,
      pdfstatus: 1,
      applications: { $size: "$applications" } // Get only the count of applications
    }).sort({ start: 1 }).lean();

    res.json(masterClasses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// masterclass apply
router.post("/masterclassapply/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, clgemail, collegename, phone } = req.body;

    // Find the masterclass
    const masterClass = await MasterClass.findById(id);
    if (!masterClass) {
      return res.status(404).json({ message: "MasterClass not found" });
    }

    // Check if the user has already applied using their email
    if (masterClass.applications.some((app) => app.email === email || app.phone === phone)) {
      return res.status(400).json({ message: "You have already applied" });
    }

    // Add the new application
    masterClass.applications.unshift({ name, email, clgemail, collegename, phone, appliedAt: new Date() });
    await masterClass.save();

    res.status(201).json({ message: "Applied successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error applying", error: error.message });
  }
});

// download certificate for masterclass
router.get("/masterclassauth/:id/:email", async (req, res) => {
  try {
    const { id, email } = req.params;

    const masterClass = await MasterClass.findById(id);
    if (!masterClass) {
      return res.status(404).json({ message: "MasterClass not found" });
    }

    const user = masterClass.applications.find(
      (app) => app.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return res.status(404).json({ message: "User not found in this MasterClass" });
    }

    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th"; // Covers 4th - 20th (special case)
      switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    const formatDate = (dateString) => {
      const dateObj = new Date(dateString);

      const day = dateObj.getDate();
      const month = dateObj.toLocaleString('en-US', { month: 'long' });
      const year = dateObj.getFullYear();

      return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
    };

    const date = formatDate(masterClass.start);
    const value = `${masterClass.title} held on ${date}.`;

    const certificateUrl = `https://res.cloudinary.com/dtchuqy2n/image/upload/co_rgb:000000,l_text:times%20new%20roman_150_bold_normal_left:${encodeURIComponent(user.name)}/fl_layer_apply,y_-45/co_rgb:000000,l_text:times%20new%20roman_35_normal_left:${encodeURIComponent(value)}/fl_layer_apply,y_170/masterclass/cdxtjxpgefkcjgejotg0`;

    return res.status(200).json({ message: "User found", certificate: certificateUrl });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;