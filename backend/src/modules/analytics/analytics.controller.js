const asyncHandler = require("../../utils/asyncHandler");
const { success } = require("../../utils/response");
const service = require("./analytics.service");

const farmerSummary = asyncHandler(async (req, res) => {
  success(res, await service.farmerSummary(req.user.id));
});

const farmerLicenseSplit = asyncHandler(async (req, res) => {
  success(res, await service.farmerLicenseSplit(req.user.id));
});

const farmerTopBuyers = asyncHandler(async (req, res) => {
  success(res, await service.farmerTopBuyers(req.user.id));
});

const buyerSummary = asyncHandler(async (req, res) => {
  success(res, await service.buyerSummary(req.user.id));
});

const buyerLicenseSplit = asyncHandler(async (req, res) => {
  success(res, await service.buyerLicenseSplit(req.user.id));
});

const buyerTopSellers = asyncHandler(async (req, res) => {
  success(res, await service.buyerTopSellers(req.user.id));
});

module.exports = {
  farmerSummary,
  farmerLicenseSplit,
  farmerTopBuyers,
  buyerSummary,
  buyerLicenseSplit,
  buyerTopSellers,
};