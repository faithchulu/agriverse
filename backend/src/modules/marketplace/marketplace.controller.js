const asyncHandler = require("../../utils/asyncHandler");
const { success } = require("../../utils/response");
const service = require("./marketplace.service");

const browseListings = asyncHandler(async (req, res) => {
  const result = await service.browseListings(req.query);
  success(res, result);
});

const getListing = asyncHandler(async (req, res) => {
  const listing = await service.getListingDetail(req.params.id);
  success(res, listing);
});

module.exports = { browseListings, getListing };