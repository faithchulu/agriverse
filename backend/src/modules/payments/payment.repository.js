const prisma = require("../../config/db");

// ---------- Transactions ----------

function createTransaction(data, tx = prisma) {
  return tx.transaction.create({ data });
}

function findTransactionByBuyerAndDataset(buyerId, datasetId, tx = prisma) {
  return tx.transaction.findFirst({
    where: { buyerId, datasetId },
    select: { id: true },
  });
}

function findTransactionById(id, tx = prisma) {
  return tx.transaction.findUnique({
    where: { id },
    include: { dataset: true },
  });
}

function updateTransaction(id, data, tx = prisma) {
  return tx.transaction.update({ where: { id }, data });
}

function findTransactionsByBuyer(buyerId) {
  return prisma.transaction.findMany({
    where: { buyerId },
    include: {
      dataset: { select: { title: true } },
      license: { select: { id: true } },
      review: { select: { id: true } },
      farmer: {
        select: {
          farmerProfile: { select: { farmName: true, fullName: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

function findTransactionsByFarmer(farmerId) {
  return prisma.transaction.findMany({
    where: { farmerId },
    include: {
      dataset: { select: { title: true } },
      license: { select: { id: true } },
      review: { select: { id: true } },
      buyer: {
        select: {
          buyerProfile: {
            select: { organizationName: true, contactName: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ---------- Licenses ----------

function createLicense(data, tx = prisma) {
  return tx.license.create({ data });
}

function findLicensesByBuyer(buyerId) {
  return prisma.license.findMany({
    where: { buyerId },
    include: {
      dataset: {
        select: {
          title: true,
          farmer: {
            select: {
              farmerProfile: { select: { farmName: true, fullName: true } },
            },
          },
        },
      },
    },
    orderBy: { grantedAt: "desc" },
  });
}

function findLicenseForDownload(licenseId, buyerId) {
  return prisma.license.findFirst({
    where: { id: licenseId, buyerId },
    include: {
      dataset: { select: { title: true, filePath: true } },
    },
  });
}

function markLicenseUsed(licenseId) {
  return prisma.license.update({
    where: { id: licenseId },
    data: { state: "USED" },
  });
}

// ---------- Disputes ----------

function createDispute(data, tx = prisma) {
  return tx.dispute.create({ data });
}

function findReviewByTransaction(transactionId) {
  return prisma.review.findUnique({ where: { transactionId } });
}

function createReview(data) {
  return prisma.review.create({ data });
}

function findReviewsByFarmer(farmerId) {
  return prisma.review.findMany({
    where: { farmerId },
    include: {
      buyer: {
        select: {
          buyerProfile: {
            select: { organizationName: true, contactName: true },
          },
        },
      },
      dataset: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ---------- Payouts ----------

function findReleasedUnpaidByFarmer(farmerId, tx = prisma) {
  return tx.transaction.findMany({
    where: { farmerId, status: "RELEASED", payoutId: null },
  });
}

function claimTransactionsForPayout(transactionIds, payoutId, tx = prisma) {
  return tx.transaction.updateMany({
    where: { id: { in: transactionIds } },
    data: { payoutId },
  });
}

function createPayout(data, tx = prisma) {
  return tx.payout.create({ data });
}

function findPayoutsByFarmer(farmerId) {
  return prisma.payout.findMany({
    where: { farmerId },
    orderBy: { createdAt: "desc" },
  });
}

module.exports = {
  createTransaction,
  findTransactionByBuyerAndDataset,
  findTransactionById,
  updateTransaction,
  findTransactionsByBuyer,
  findTransactionsByFarmer,
  createLicense,
  findLicensesByBuyer,
  findLicenseForDownload,
  markLicenseUsed,
  createDispute,
  findReviewByTransaction,
  createReview,
  findReviewsByFarmer,
  findReleasedUnpaidByFarmer,
  claimTransactionsForPayout,
  createPayout,
  findPayoutsByFarmer,
};
