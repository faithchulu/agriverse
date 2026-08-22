const express = require("express");
const controller = require("./analytics.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const requireRole = require("../../middleware/role.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/farmer/summary", requireRole("FARMER"), controller.farmerSummary);
router.get("/farmer/license-split", requireRole("FARMER"), controller.farmerLicenseSplit);
router.get("/farmer/top-buyers", requireRole("FARMER"), controller.farmerTopBuyers);

router.get("/buyer/summary", requireRole("BUYER"), controller.buyerSummary);
router.get("/buyer/license-split", requireRole("BUYER"), controller.buyerLicenseSplit);
router.get("/buyer/top-sellers", requireRole("BUYER"), controller.buyerTopSellers);

module.exports = router;