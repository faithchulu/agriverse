const prisma = require("../../config/db");

// ---------- Farmer ----------

function countActiveListings(farmerId) {
  return prisma.dataset.count({ where: { farmerId, status: "LIVE" } });
}

function farmerReleasedTransactions(farmerId) {
  return prisma.transaction.findMany({
    where: { farmerId, status: "RELEASED" },
    select: { amount: true, licenseType: true },
  });
}

function farmerAverageRating(farmerId) {
  return prisma.review.aggregate({
    where: { farmerId },
    _avg: { rating: true },
    _count: { rating: true },
  });
}

function topBuyersForFarmer(farmerId) {
  return prisma.transaction.groupBy({
    by: ["buyerId"],
    where: { farmerId, status: "RELEASED" },
    _sum: { amount: true },
    _count: { _all: true },
    _max: { createdAt: true },
    orderBy: { _sum: { amount: "desc" } },
    take: 5,
  });
}

function buyerProfilesByIds(ids) {
  return prisma.user.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      buyerProfile: { select: { organizationName: true, contactName: true } },
    },
  });
}

// ---------- Buyer ----------

function countActiveLicenses(buyerId) {
  return prisma.license.count({
    where: {
      buyerId,
      state: "ACTIVE",
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  });
}

function buyerCountedTransactions(buyerId) {
  return prisma.transaction.findMany({
    where: { buyerId, status: { in: ["PAID", "RELEASED", "DISPUTED"] } },
    select: { amount: true, status: true },
  });
}

function buyerReleasedTransactions(buyerId) {
  return prisma.transaction.findMany({
    where: { buyerId, status: "RELEASED" },
    select: { licenseType: true },
  });
}

function countOpenDisputesForBuyer(buyerId) {
  return prisma.dispute.count({
    where: { status: "OPEN", transaction: { buyerId } },
  });
}

function topSellersForBuyer(buyerId) {
  return prisma.transaction.groupBy({
    by: ["farmerId"],
    where: { buyerId, status: "RELEASED" },
    _sum: { amount: true },
    _count: { _all: true },
    _max: { createdAt: true },
    orderBy: { _sum: { amount: "desc" } },
    take: 5,
  });
}

function farmerProfilesByIds(ids) {
  return prisma.user.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      farmerProfile: { select: { farmName: true, fullName: true } },
    },
  });
}

function farmerDashboardTransactions(farmerId) {
  return prisma.transaction.findMany({
    where: { farmerId },
    include: {
      dataset: { select: { title: true } },
      buyer: {
        select: {
          buyerProfile: {
            select: { organizationName: true, contactName: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

function farmerDashboardPayouts(farmerId) {
  return prisma.payout.findMany({
    where: { farmerId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

function farmerDashboardReviews(farmerId) {
  return prisma.review.findMany({
    where: { farmerId },
    include: {
      dataset: { select: { title: true } },
      buyer: {
        select: {
          buyerProfile: {
            select: { organizationName: true, contactName: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

function farmerDashboardDatasets(farmerId) {
  return prisma.dataset.findMany({
    where: { farmerId },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { id: true, title: true, createdAt: true },
  });
}

function buyerDashboardTransactions(buyerId) {
  return prisma.transaction.findMany({
    where: { buyerId },
    include: {
      dataset: { select: { title: true } },
      farmer: {
        select: {
          farmerProfile: { select: { farmName: true, fullName: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

function buyerDashboardDisputes(buyerId) {
  return prisma.dispute.findMany({
    where: { transaction: { buyerId } },
    include: {
      transaction: { include: { dataset: { select: { title: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

function buyerDashboardLicenses(buyerId) {
  return prisma.license.findMany({
    where: { buyerId },
    include: { dataset: { select: { title: true } } },
    orderBy: { grantedAt: "desc" },
    take: 20,
  });
}

module.exports = {
  countActiveListings,
  farmerReleasedTransactions,
  farmerAverageRating,
  topBuyersForFarmer,
  buyerProfilesByIds,
  countActiveLicenses,
  buyerCountedTransactions,
  buyerReleasedTransactions,
  countOpenDisputesForBuyer,
  topSellersForBuyer,
  farmerProfilesByIds,
  farmerDashboardTransactions,
  farmerDashboardPayouts,
  farmerDashboardReviews,
  farmerDashboardDatasets,
  buyerDashboardTransactions,
  buyerDashboardDisputes,
  buyerDashboardLicenses,
};
