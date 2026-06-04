const express = require("express");
const MasterClass = require("../models/MasterClass");
const { sendMasterclassWelcomeEmail, sendMasterclassCertificateEmail } = require("../utils/emailService");
const router = express.Router();

const getCertificatePayload = (masterClass, applicantName) => {
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
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

  return `https://res.cloudinary.com/dtchuqy2n/image/upload/co_rgb:000000,l_text:times%20new%20roman_150_bold_normal_left:${encodeURIComponent(applicantName)}/fl_layer_apply,y_-45/co_rgb:000000,l_text:times%20new%20roman_35_normal_left:${encodeURIComponent(value)}/fl_layer_apply,y_170/masterclass/cdxtjxpgefkcjgejotg0`;
};

const issueCertificatesForMasterclass = async (masterClass) => {
  const Certificate = require("../models/Certificate");

  const issuancePromises = (masterClass.applications || []).map(async (app) => {
    try {
      if (!app || !app.email) return { email: null, status: "skipped" };

      const emailLower = String(app.email).toLowerCase();
      const applicantName = app.name || emailLower.split("@")[0];

      // Check if a certificate already exists for this applicant for THIS masterclass
      const existing = await Certificate.findOne({ email: emailLower, enrolment: String(masterClass._id) });
      if (existing) {
        let emailSent = false;
        try {
          emailSent = await sendMasterclassCertificateEmail(emailLower, applicantName, masterClass.title, existing.url);
        } catch (e) {
          console.error("Failed to resend certificate email to", emailLower, e);
        }
        return { email: emailLower, status: emailSent ? "resent" : "email_failed" };
      }

      const certificateUrl = getCertificatePayload(masterClass, applicantName);

      const newCert = new Certificate({
        name: applicantName,
        email: emailLower,
        domain: masterClass.title || "Masterclass",
        enrolment: String(masterClass._id),
        startdate: masterClass.start || "",
        url: certificateUrl,
        delivered: true,
      });

      await newCert.save();

      let emailSent = false;
      try {
        emailSent = await sendMasterclassCertificateEmail(emailLower, applicantName, masterClass.title, certificateUrl);
      } catch (e) {
        console.error("Failed to send certificate email to", emailLower, e);
      }

      return { email: emailLower, status: emailSent ? "issued" : "email_failed" };
    } catch (e) {
      console.error("Error issuing certificate for application:", e);
      return { email: app?.email || null, status: "error" };
    }
  });

  return Promise.allSettled(issuancePromises);
};

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

// Get a single MasterClass by ID (for the detailed page)
router.get("/masterclass/:id", async (req, res) => {
    try {
      const masterClass = await MasterClass.findById(req.params.id, { applications: 0 });
      if (!masterClass) return res.status(404).json({ error: "MasterClass not found" });
      res.status(200).json(masterClass);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Get a single MasterClass by slug or ID with related classes included (for high performance details page)
router.get("/masterclass/by-slug-or-id/:identifier", async (req, res) => {
    try {
        const { identifier } = req.params;
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);

        // Run main + related queries in parallel for maximum speed
        const masterClassQuery = isObjectId
            ? MasterClass.findById(identifier, { applications: 0 }).lean()
            : MasterClass.findOne({ slug: identifier }, { applications: 0 }).lean();

        const [masterClass, related] = await Promise.all([
            masterClassQuery,
            // We don't know the masterClass _id yet for $ne, so fetch related after
        ]);

        if (!masterClass) {
            return res.status(404).json({ error: "MasterClass not found" });
        }

        // Fetch related classes (upcoming or ongoing, excluding the current one)
        const related2 = await MasterClass.find(
            { _id: { $ne: masterClass._id }, status: { $in: ["upcoming", "ongoing"] } },
            { title: 1, start: 1, end: 1, link: 1, image: 1, status: 1, duration: 1,
              registeredCount: 1, instructorName: 1, instructorDesignation: 1, instructorPhoto: 1, slug: 1 }
        ).limit(3).lean();

        res.status(200).json({ masterclass: masterClass, related: related2 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a MasterClass
router.put("/masterclass/:id", async (req, res) => {
    try {
      // Load existing masterclass to detect status change
      const masterClass = await MasterClass.findById(req.params.id);
      if (!masterClass) return res.status(404).json({ error: "MasterClass not found" });

      const previousStatus = masterClass.status;

      // Apply updates
      Object.assign(masterClass, req.body);
      const updated = await masterClass.save();

      // If status changed to completed, auto-issue certificates
      if (previousStatus !== "completed" && String(updated.status).toLowerCase() === "completed") {
        issueCertificatesForMasterclass(updated)
          .then((r) => console.log(`Certificate issuance completed with ${r.length} attempts`))
          .catch((e) => console.error("Certificate issuance failed:", e));
      }

      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Manually generate and email certificates for a masterclass
router.post("/masterclass/:id/generate-certificates", async (req, res) => {
  try {
    const masterClass = await MasterClass.findById(req.params.id);
    if (!masterClass) return res.status(404).json({ error: "MasterClass not found" });

    const results = await issueCertificatesForMasterclass(masterClass);
    res.status(200).json({
      message: "Certificate generation started successfully",
      totalApplications: masterClass.applications?.length || 0,
      results,
    });
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
      duration: 1,
      registeredCount: 1,
      instructorName: 1,
      instructorDesignation: 1,
      instructorPhoto: 1,
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
    const { name, email, experience, field, phone } = req.body;

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
    masterClass.applications.unshift({ name, email, experience, field, phone, appliedAt: new Date() });
    await masterClass.save();

    // Send the welcome email
    sendMasterclassWelcomeEmail(email, name, masterClass.title, masterClass.start, masterClass.link).catch(console.error);

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