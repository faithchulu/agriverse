const repo = require("./analytics.repository");
const { fromEnumCase } = require("../../utils/normalize");

const LICENSE_KINDS = ["ONE_TIME", "TIME_LIMITED", "RESEARCH_ONLY"];
const LICENSE_LABEL = {
  ONE_TIME: "One-time download",
  TIME_LIMITED: "Time-limited access",
  RESEARCH_ONLY: "Research use only",
};

function licenseSplit(rows, kindField = "licenseType") {
  const total = rows.length;
  return LICENSE_KINDS.map((kind) => {
    const count = rows.filter((r) => r[kindField] === kind).length;
    return {
      kind: fromEnumCase(kind),
      label: LICENSE_LABEL[kind],
      count,
      percent: total === 0 ? 0 : Math.round((count / total) * 100),
    };
  });
}

// ---------- Farmer ----------

async function farmerSummary(farmerId) {
  const [activeListings, releasedTxns, rating] = await Promise.all([
    repo.countActiveListings(farmerId),
    repo.farmerReleasedTransactions(farmerId),
    repo.farmerAverageRating(farmerId),
  ]);

  const totalEarnings = releasedTxns.reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    activeListings,
    totalEarnings,
    datasetsSold: releasedTxns.length,
    averageRating: rating._avg.rating ? Number(rating._avg.rating.toFixed(1)) : 0,
    ratingCount: rating._count.rating,
  };
}

async function farmerLicenseSplit(farmerId) {
  const rows = await repo.farmerReleasedTransactions(farmerId);
  return licenseSplit(rows);
}

async function farmerTopBuyers(farmerId) {
  const grouped = await repo.topBuyersForFarmer(farmerId);
  if (grouped.length === 0) return [];

  const profiles = await repo.buyerProfilesByIds(grouped.map((g) => g.buyerId));
  const profileMap = new Map(profiles.map((p) => [p.id, p.buyerProfile]));

  return grouped.map((g) => {
    const profile = profileMap.get(g.buyerId);
    return {
      name: profile?.organizationName || profile?.contactName || "Unknown buyer",
      datasetsPurchased: g._count._all,
      totalSpent: Number(g._sum.amount),
      lastPurchase: g._max.createdAt,
    };
  });
}

// ---------- Buyer ----------

async function buyerSummary(buyerId) {
  const [activeLicenses, countedTxns, openDisputes] = await Promise.all([
    repo.countActiveLicenses(buyerId),
    repo.buyerCountedTransactions(buyerId),
    repo.countOpenDisputesForBuyer(buyerId),
  ]);

  const totalSpent = countedTxns.reduce((sum, t) => sum + Number(t.amount), 0);
  const datasetsPurchased = countedTxns.filter((t) => t.status === "RELEASED").length;

  return { activeLicenses, totalSpent, datasetsPurchased, openDisputes };
}

async function buyerLicenseSplit(buyerId) {
  const rows = await repo.buyerReleasedTransactions(buyerId);
  return licenseSplit(rows);
}

async function buyerTopSellers(buyerId) {
  const grouped = await repo.topSellersForBuyer(buyerId);
  if (grouped.length === 0) return [];

  const profiles = await repo.farmerProfilesByIds(grouped.map((g) => g.farmerId));
  const profileMap = new Map(profiles.map((p) => [p.id, p.farmerProfile]));

  return grouped.map((g) => {
    const profile = profileMap.get(g.farmerId);
    return {
      name: profile?.farmName || profile?.fullName || "Unknown seller",
      datasetsPurchased: g._count._all,
      totalSpent: Number(g._sum.amount),
      lastPurchase: g._max.createdAt,
    };
  });
}

module.exports = {
  farmerSummary,
  farmerLicenseSplit,
  farmerTopBuyers,
  buyerSummary,
  buyerLicenseSplit,
  buyerTopSellers,
};