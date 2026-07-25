const express = require("express");

const {
  createLead,
  getLeads,
  getLeadStats,
  getLeadByTrackingId,
  getLeadById,
  getLeadActivity,
  updateLeadStatus,
  addAdminNote,
} = require("../controllers/leadController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/", createLead);

router.get(
  "/track/:trackingId",
  getLeadByTrackingId
);

// Protected admin routes
router.get(
  "/",
  protect,
  getLeads
);

router.get(
  "/stats",
  protect,
  getLeadStats
);

router.get(
  "/:id/activity",
  protect,
  getLeadActivity
);

router.post(
  "/:id/notes",
  protect,
  addAdminNote
);

router.get(
  "/:id",
  protect,
  getLeadById
);

router.patch(
  "/:id/status",
  protect,
  updateLeadStatus
);

module.exports = router;