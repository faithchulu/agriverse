const asyncHandler = require("../../utils/asynchandler");
const { success } = require("../../utils/response");
const service = require("./marketplace.service");

const browseListings = asyncHandler(async (req, res) => {
  const result = await service.browseListings(req.query, req.user.id);
  success(res, result);
});

const getListing = asyncHandler(async (req, res) => {
  const listing = await service.getListingDetail(req.params.id, req.user.id);
  success(res, listing);
});

const listSavedListings = asyncHandler(async (req, res) => {
  const listings = await service.listSavedListings(req.user.id);
  success(res, listings);
});

const saveListing = asyncHandler(async (req, res) => {
  const result = await service.saveListing(req.user.id, req.params.id);
  success(res, result, 201);
});

const removeSavedListing = asyncHandler(async (req, res) => {
  const result = await service.removeSavedListing(req.user.id, req.params.id);
  success(res, result);
});

module.exports = {
  browseListings,
  getListing,
  listSavedListings,
  saveListing,
  removeSavedListing,
};
