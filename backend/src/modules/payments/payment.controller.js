const asyncHandler = require("../../utils/asyncHandler");
const path = require("path");
const { success } = require("../../utils/response");
const service = require("./payment.service");

const purchase = asyncHandler(async (req, res) => {
  const transaction = await service.purchaseListing(
    req.user.id,
    req.params.datasetId,
  );
  success(res, transaction, 201);
});

const pay = asyncHandler(async (req, res) => {
  const transaction = await service.payTransaction(req.user.id, req.params.id);
  success(res, transaction);
});

const release = asyncHandler(async (req, res) => {
  const transaction = await service.releaseTransaction(
    req.user.id,
    req.params.id,
  );
  success(res, transaction);
});

const dispute = asyncHandler(async (req, res) => {
  const transaction = await service.raiseDispute(
    req.user.id,
    req.params.id,
    req.body.reason,
  );
  success(res, transaction);
});

const listMyTransactions = asyncHandler(async (req, res) => {
  const transactions = await service.listMyTransactions(
    req.user.id,
    req.user.role,
  );
  success(res, transactions);
});

const listMyLicenses = asyncHandler(async (req, res) => {
  const licenses = await service.listMyLicenses(req.user.id);
  success(res, licenses);
});

const downloadLicense = asyncHandler(async (req, res) => {
  const download = await service.authorizeLicenseDownload(
    req.user.id,
    req.params.id,
  );
  const extension = path.extname(download.filePath);
  const safeName = download.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

  res.download(download.filePath, `${safeName}${extension}`, async (err) => {
    if (!err && download.oneTime) {
      await service.markLicenseUsed(req.params.id);
    }
  });
});

const getPayoutBalance = asyncHandler(async (req, res) => {
  const balance = await service.getPayoutBalance(req.user.id);
  success(res, { availableBalance: balance });
});

const requestPayout = asyncHandler(async (req, res) => {
  const payout = await service.requestPayout(req.user.id, req.body.method);
  success(res, payout, 201);
});

const listMyPayouts = asyncHandler(async (req, res) => {
  const payouts = await service.listMyPayouts(req.user.id);
  success(res, payouts);
});

const submitBuyerReview = asyncHandler(async (req, res) => {
  const review = await service.createReview(
    req.user.id,
    req.params.id,
    req.body.rating,
    req.body.comment,
  );
  success(res, review, 201);
});

const getFarmerReputationHistory = asyncHandler(async (req, res) => {
  const reputationHistory = await service.farmerReputation(req.user.id);
  success(res, reputationHistory);
});

module.exports = {
  purchase,
  pay,
  release,
  dispute,
  listMyTransactions,
  listMyLicenses,
  downloadLicense,
  getPayoutBalance,
  requestPayout,
  listMyPayouts,
  submitBuyerReview,
  getFarmerReputationHistory,
};
