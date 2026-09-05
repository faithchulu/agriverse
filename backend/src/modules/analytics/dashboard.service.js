const prisma = require("../../config/db");

function monthBuckets() {
  const buckets = [];
  const now = new Date();
  for (let offset = 11; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    buckets.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString("en", { month: "short" }),
      primary: 0,
      secondary: 0,
    });
  }
  return buckets;
}

function dayBuckets() {
  const buckets = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - offset);
    buckets.push({
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("en", { weekday: "short" }).slice(0, 1),
      primary: 0,
      secondary: 0,
    });
  }
  return buckets;
}

function addMonth(buckets, dateValue, field, amount) {
  const date = new Date(dateValue);
  const bucket = buckets.find(
    (item) => item.key === `${date.getFullYear()}-${date.getMonth()}`,
  );
  if (bucket) bucket[field] += amount;
}

function addDay(buckets, dateValue, field) {
  const bucket = buckets.find(
    (item) => item.key === new Date(dateValue).toISOString().slice(0, 10),
  );
  if (bucket) bucket[field] += 1;
}

function trendResult(buckets) {
  return {
    labels: buckets.map((item) => item.label),
    primary: buckets.map((item) => item.primary),
    secondary: buckets.map((item) => item.secondary),
  };
}

async function farmerTransactions(farmerId) {
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
    take: 50,
  });
}

async function buyerTransactions(buyerId) {
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
    take: 50,
  });
}

async function farmerTrends(farmerId) {
  const [transactions, payouts] = await Promise.all([
    farmerTransactions(farmerId),
    prisma.payout.findMany({
      where: { farmerId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);
  const months = monthBuckets();
  transactions
    .filter((item) => item.status === "RELEASED")
    .forEach((item) =>
      addMonth(months, item.createdAt, "primary", Number(item.amount)),
    );
  payouts
    .filter((item) => item.status === "COMPLETED")
    .forEach((item) =>
      addMonth(months, item.createdAt, "secondary", Number(item.amount)),
    );
  return trendResult(months);
}

async function buyerTrends(buyerId) {
  const transactions = await buyerTransactions(buyerId);
  const months = monthBuckets();
  transactions
    .filter((item) => ["PAID", "RELEASED", "DISPUTED"].includes(item.status))
    .forEach((item) =>
      addMonth(months, item.createdAt, "primary", Number(item.amount)),
    );
  transactions
    .filter((item) => item.status === "REFUNDED")
    .forEach((item) =>
      addMonth(months, item.createdAt, "secondary", Number(item.amount)),
    );
  return trendResult(months);
}

async function farmerWeekly(farmerId) {
  const [transactions, disputes] = await Promise.all([
    farmerTransactions(farmerId),
    prisma.dispute.findMany({
      where: { transaction: { farmerId } },
      select: { createdAt: true },
    }),
  ]);
  const days = dayBuckets();
  transactions
    .filter((item) => item.status === "RELEASED")
    .forEach((item) => addDay(days, item.createdAt, "primary"));
  disputes.forEach((item) => addDay(days, item.createdAt, "secondary"));
  return trendResult(days);
}

async function buyerWeekly(buyerId) {
  const [transactions, disputes] = await Promise.all([
    buyerTransactions(buyerId),
    prisma.dispute.findMany({
      where: { transaction: { buyerId } },
      select: { createdAt: true },
    }),
  ]);
  const days = dayBuckets();
  transactions
    .filter((item) => item.status === "RELEASED")
    .forEach((item) => addDay(days, item.createdAt, "primary"));
  disputes.forEach((item) => addDay(days, item.createdAt, "secondary"));
  return trendResult(days);
}

async function farmerActivity(farmerId) {
  const [transactions, payouts, reviews, datasets] = await Promise.all([
    farmerTransactions(farmerId),
    prisma.payout.findMany({
      where: { farmerId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.review.findMany({
      where: { farmerId },
      include: {
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
    }),
    prisma.dataset.findMany({
      where: { farmerId },
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);
  const items = [
    ...transactions.map((item) => ({
      id: `sale-${item.id}`,
      type: "sale",
      date: item.createdAt,
      description: `${item.buyer.buyerProfile?.organizationName || item.buyer.buyerProfile?.contactName || "A buyer"} purchased "${item.dataset.title}"`,
    })),
    ...payouts.map((item) => ({
      id: `payout-${item.id}`,
      type: "payout",
      date: item.createdAt,
      description: `Payout of ZMW ${Number(item.amount).toFixed(2)} is ${item.status.toLowerCase()}`,
    })),
    ...reviews.map((item) => ({
      id: `review-${item.id}`,
      type: "review",
      date: item.createdAt,
      description: `${item.buyer.buyerProfile?.organizationName || item.buyer.buyerProfile?.contactName || "A buyer"} left a ${item.rating}-star review`,
    })),
    ...datasets.map((item) => ({
      id: `upload-${item.id}`,
      type: "upload",
      date: item.createdAt,
      description: `You published "${item.title}"`,
    })),
  ];
  return items.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
}

async function farmerBuyerInterest(farmerId) {
  const transactions = await farmerTransactions(farmerId);
  return transactions.slice(0, 5).map((item) => ({
    id: item.id,
    buyerName:
      item.buyer.buyerProfile?.organizationName ||
      item.buyer.buyerProfile?.contactName ||
      "Unknown buyer",
    action: "purchased",
    datasetTitle: item.dataset.title,
    date: item.createdAt,
  }));
}

async function buyerActivity(buyerId) {
  const [transactions, disputes, licenses] = await Promise.all([
    buyerTransactions(buyerId),
    prisma.dispute.findMany({
      where: { transaction: { buyerId } },
      include: {
        transaction: { include: { dataset: { select: { title: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.license.findMany({
      where: { buyerId },
      include: { dataset: { select: { title: true } } },
      orderBy: { grantedAt: "desc" },
      take: 20,
    }),
  ]);
  const items = [
    ...transactions.map((item) => ({
      id: `purchase-${item.id}`,
      type: "purchase",
      date: item.createdAt,
      description: `You purchased "${item.dataset.title}"`,
    })),
    ...disputes.map((item) => ({
      id: `dispute-${item.id}`,
      type: "dispute",
      date: item.createdAt,
      description: `Your dispute on "${item.transaction.dataset.title}" is ${item.status.toLowerCase()}`,
    })),
    ...licenses.map((item) => ({
      id: `license-${item.id}`,
      type: "expiring",
      date: item.grantedAt,
      description: `License granted for "${item.dataset.title}"`,
    })),
  ];
  return items.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
}

module.exports = {
  farmerTrends,
  buyerTrends,
  farmerWeekly,
  buyerWeekly,
  farmerActivity,
  farmerBuyerInterest,
  buyerActivity,
};
