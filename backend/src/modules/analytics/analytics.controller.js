const asyncHandler = require("../../utils/asyncHandler");
const { success } = require("../../utils/response");
const service = require("./analytics.service");
const dashboard = require("./dashboard.service");

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

const farmerTrends = asyncHandler(async (req, res) =>
  success(res, await dashboard.farmerTrends(req.user.id)),
);
const buyerTrends = asyncHandler(async (req, res) =>
  success(res, await dashboard.buyerTrends(req.user.id)),
);
const farmerWeekly = asyncHandler(async (req, res) =>
  success(res, await dashboard.farmerWeekly(req.user.id)),
);
const buyerWeekly = asyncHandler(async (req, res) =>
  success(res, await dashboard.buyerWeekly(req.user.id)),
);
const farmerActivity = asyncHandler(async (req, res) =>
  success(res, await dashboard.farmerActivity(req.user.id)),
);
const farmerBuyerInterest = asyncHandler(async (req, res) =>
  success(res, await dashboard.farmerBuyerInterest(req.user.id)),
);
const buyerActivity = asyncHandler(async (req, res) =>
  success(res, await dashboard.buyerActivity(req.user.id)),
);

module.exports = {
  farmerSummary,
  farmerLicenseSplit,
  farmerTopBuyers,
  buyerSummary,
  buyerLicenseSplit,
  buyerTopSellers,
  farmerTrends,
  buyerTrends,
  farmerWeekly,
  buyerWeekly,
  farmerActivity,
  farmerBuyerInterest,
  buyerActivity,
};
