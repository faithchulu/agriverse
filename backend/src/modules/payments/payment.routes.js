const express = require("express");
const controller = require("./payment.controller");
const validate = require("../../middleware/validate.middleware");
const authMiddleware = require("../../middleware/auth.middleware");
const requireRole = require("../../middleware/role.middleware");
const { raiseDisputeSchema, requestPayoutSchema } = require("./payment.validation");

const router = express.Router();

router.use(authMiddleware);

// Purchase flow — buyer only
router.post("/listings/:datasetId/purchase", requireRole("BUYER"), controller.purchase);
router.post("/transactions/:id/pay", requireRole("BUYER"), controller.pay);
router.post("/transactions/:id/release", requireRole("BUYER"), controller.release);

// Disputes — either party on the transaction (service checks membership)
router.post("/transactions/:id/dispute", validate(raiseDisputeSchema), controller.dispute);

// Viewing — role-aware inside the service, both roles allowed here
router.get("/transactions/mine", controller.listMyTransactions);

// Licenses — buyer only
router.get("/licenses/mine", requireRole("BUYER"), controller.listMyLicenses);

// Payouts — farmer only
router.get("/payouts/balance", requireRole("FARMER"), controller.getPayoutBalance);
router.post("/payouts", requireRole("FARMER"), validate(requestPayoutSchema), controller.requestPayout);
router.get("/payouts/mine", requireRole("FARMER"), controller.listMyPayouts);

module.exports = router;