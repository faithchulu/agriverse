const express = require("express");
const controller = require("./marketplace.controller");
const validate = require("../../middleware/validate.middleware");
const authMiddleware = require("../../middleware/auth.middleware");
const requireRole = require("../../middleware/role.middleware");
const { browseListingsQuerySchema } = require("./marketplace.validation");

const router = express.Router();

router.use(authMiddleware);

router.get("/saved", requireRole("BUYER"), controller.listSavedListings);
router.post("/listings/:id/save", requireRole("BUYER"), controller.saveListing);
router.delete(
  "/listings/:id/save",
  requireRole("BUYER"),
  controller.removeSavedListing,
);

router.get(
  "/listings",
  validate(browseListingsQuerySchema, "query"),
  controller.browseListings,
);
router.get("/listings/:id", controller.getListing);

module.exports = router;
