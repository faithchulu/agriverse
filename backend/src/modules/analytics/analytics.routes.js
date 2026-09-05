const express = require("express");
const controller = require("./analytics.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const requireRole = require("../../middleware/role.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/farmer/summary", requireRole("FARMER"), controller.farmerSummary);
router.get(
  "/farmer/license-split",
  requireRole("FARMER"),
  controller.farmerLicenseSplit,
);
router.get(
  "/farmer/top-buyers",
  requireRole("FARMER"),
  controller.farmerTopBuyers,
);
router.get("/farmer/trends", requireRole("FARMER"), controller.farmerTrends);
router.get("/farmer/weekly", requireRole("FARMER"), controller.farmerWeekly);
router.get(
  "/farmer/activity",
  requireRole("FARMER"),
  controller.farmerActivity,
);
router.get(
  "/farmer/buyer-interest",
  requireRole("FARMER"),
  controller.farmerBuyerInterest,
);

router.get("/buyer/summary", requireRole("BUYER"), controller.buyerSummary);
router.get(
  "/buyer/license-split",
  requireRole("BUYER"),
  controller.buyerLicenseSplit,
);
router.get(
  "/buyer/top-sellers",
  requireRole("BUYER"),
  controller.buyerTopSellers,
);
router.get("/buyer/trends", requireRole("BUYER"), controller.buyerTrends);
router.get("/buyer/weekly", requireRole("BUYER"), controller.buyerWeekly);
router.get("/buyer/activity", requireRole("BUYER"), controller.buyerActivity);

module.exports = router;
