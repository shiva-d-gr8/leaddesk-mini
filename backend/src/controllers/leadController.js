const Lead = require("../models/Lead");
const Activity = require("../models/Activity");

const generateTrackingId = require("../utils/generateTrackingId");

const {
  calculateLeadScore,
  getPriority,
} = require("../services/leadScoringService");

const generateProjectBrief = require("../services/projectBriefService");


// CREATE LEAD
const createLead = async (req, res) => {
  try {
    const {
      name,
      email,
      projectType,
      budgetRange,
      timeline,
      message,
    } = req.body;


    // Required field validation
    if (
      !name ||
      !email ||
      !projectType ||
      !budgetRange ||
      !timeline ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }


    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }


    // Name validation
    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 2 characters",
      });
    }


    // Message validation
    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Message must contain at least 10 characters",
      });
    }


    // Duplicate active enquiry check
    const existingLead = await Lead.findOne({
      email: email.toLowerCase(),
      status: { $ne: "Closed" },
    });

    if (existingLead) {
      return res.status(409).json({
        success: false,
        message: "An active enquiry already exists for this email",
        trackingId: existingLead.trackingId,
      });
    }


    // Calculate lead score
    const leadScore = calculateLeadScore({
      budgetRange,
      timeline,
      projectType,
      message,
    });


    // Determine priority
    const priority = getPriority(leadScore);


    // Generate project brief
    const projectBrief = generateProjectBrief({
      projectType,
      budgetRange,
      timeline,
    });


    // Create lead
    const lead = await Lead.create({
      trackingId: generateTrackingId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      projectType,
      budgetRange,
      timeline,
      message: message.trim(),
      leadScore,
      priority,
      projectBrief,
    });

    await Activity.create({
  lead: lead._id,
  type: "ENQUIRY_CREATED",
  description: "New project enquiry submitted",
});


    // Send response
    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      trackingId: lead.trackingId,
      leadScore: lead.leadScore,
      priority: lead.priority,
      projectBrief: lead.projectBrief,
    });

 } catch (error) {
  console.error("CREATE LEAD ERROR:", error);

  res.status(500).json({
    success: false,
    message: "Failed to create enquiry",
    error: error.message,
  });
}
};


// GET LEADS
const getLeads = async (req, res) => {
  try {
    const {
      search = "",
      status = "All",
      page = 1,
      limit = 6,
    } = req.query;

    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          email: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          trackingId: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [leads, totalLeads] = await Promise.all([
      Lead.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(Number(limit)),

      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(
      totalLeads / limit
    );

    res.status(200).json({
      success: true,
      count: leads.length,
      totalLeads,
      currentPage: Number(page),
      totalPages,
      leads,
    });
  } catch (error) {
    console.error("GET LEADS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
      error: error.message,
    });
  }
};


// UPDATE LEAD STATUS
const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "New",
      "Contacted",
      "Closed",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const previousStatus = lead.status;

    if (previousStatus === status) {
      return res.status(400).json({
        success: false,
        message: `Lead is already marked as ${status}`,
      });
    }

    lead.status = status;

    await lead.save();

    await Activity.create({
      lead: lead._id,
      type: "STATUS_CHANGED",
      description: `Status changed from ${previousStatus} to ${status}`,
      previousStatus,
      newStatus: status,
    });

    res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update lead status",
      error: error.message,
    });
  }
};

const getLeadByTrackingId = async (req, res) => {
  try {
    const { trackingId } = req.params;

    const lead = await Lead.findOne({
      trackingId,
    }).select(
      "trackingId name projectType status priority projectBrief createdAt updatedAt"
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiry",
      error: error.message,
    });
  }
};

const getLeadActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const activities = await Activity.find({
      lead: id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch lead activity",
      error: error.message,
    });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error("GET LEAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lead",
    });
  }
};

const addAdminNote = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Note cannot be empty",
      });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    lead.adminNotes.push({
      text: text.trim(),
    });

    await lead.save();

    await Activity.create({
      lead: lead._id,
      type: "NOTE_ADDED",
      description: "Internal admin note added",
    });

    res.status(201).json({
      success: true,
      message: "Admin note added successfully",
      lead,
    });
  } catch (error) {
    console.error("ADD ADMIN NOTE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add admin note",
      error: error.message,
    });
  }
};

const getLeadStats = async (req, res) => {
  try {
    const stats = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityStats = await Lead.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalLeads = await Lead.countDocuments();

    const formattedStats = {
      total: totalLeads,
      new: 0,
      contacted: 0,
      closed: 0,
      highPriority: 0,
    };

    stats.forEach((item) => {
      if (item._id === "New") {
        formattedStats.new = item.count;
      }

      if (item._id === "Contacted") {
        formattedStats.contacted = item.count;
      }

      if (item._id === "Closed") {
        formattedStats.closed = item.count;
      }
    });

    priorityStats.forEach((item) => {
      if (item._id === "High") {
        formattedStats.highPriority = item.count;
      }
    });

    res.status(200).json({
      success: true,
      stats: formattedStats,
    });
  } catch (error) {
    console.error("GET LEAD STATS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lead statistics",
      error: error.message,
    });
  }
};

// EXPORT CONTROLLERS
module.exports = {
  createLead,
  getLeads,
  getLeadStats,
  getLeadById,
  getLeadActivity,
  getLeadByTrackingId,
  updateLeadStatus,
  addAdminNote,
};