const express = require("express");
const controller = require("./marketplace.controller");
const validate = require("../../middleware/validate.middleware");
const authMiddleware = require("../../middleware/auth.middleware");
const { browseListingsQuerySchema } = require("./marketplace.validation");

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/listings",
  validate(browseListingsQuerySchema, "query"),
  controller.browseListings,
);
router.get("/listings/:id", controller.getListing);

module.exports = router;
