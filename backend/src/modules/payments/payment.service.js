const crypto = require("crypto");
const prisma = require("../../config/db");
const repo = require("./payment.repository");
const { fromEnumCase } = require("../../utils/normalize");

const TIME_LIMITED_LICENSE_DAYS = 30;

function generateReference() {
  return `REF-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

function assertParty(transaction, userId, field, label) {
  if (transaction[field] !== userId) {
    const err = new Error(`You're not the ${label} on this transaction`);
    err.status = 403;
    throw err;
  }
}

function assertStatus(transaction, expected) {
  if (transaction.status !== expected) {
    const err = new Error(
      `This transaction is "${transaction.status.toLowerCase()}", not "${expected.toLowerCase()}"`,
    );
    err.status = 409;
    throw err;
  }
}

// ---------- Purchase → pay → release ----------

async function purchaseListing(buyerId, datasetId) {
  return prisma.$transaction(async (tx) => {
    const dataset = await tx.dataset.findUnique({ where: { id: datasetId } });

    if (!dataset || dataset.status !== "LIVE") {
      const err = new Error("This dataset is no longer available");
      err.status = 409;
      throw err;
    }

    const existingPurchase = await repo.findTransactionByBuyerAndDataset(
      buyerId,
      datasetId,
      tx,
    );
    if (existingPurchase) {
      const err = new Error("You have already purchased this dataset");
      err.status = 409;
      throw err;
    }

    const transaction = await repo.createTransaction(
      {
        datasetId,
        buyerId,
        farmerId: dataset.farmerId,
        licenseType: dataset.licenseType,
        amount: dataset.price,
        status: "PENDING",
      },
      tx,
    );

    return transaction;
  });
}

async function payTransaction(buyerId, transactionId) {
  const transaction = await repo.findTransactionById(transactionId);
  if (!transaction) {
    const err = new Error("Transaction not found");
    err.status = 404;
    throw err;
  }
  assertParty(transaction, buyerId, "buyerId", "buyer");
  assertStatus(transaction, "PENDING");

  return repo.updateTransaction(transactionId, { status: "PAID" });
}

async function releaseTransaction(buyerId, transactionId) {
  const transaction = await repo.findTransactionById(transactionId);
  if (!transaction) {
    const err = new Error("Transaction not found");
    err.status = 404;
    throw err;
  }
  assertParty(transaction, buyerId, "buyerId", "buyer");
  assertStatus(transaction, "PAID");

  return prisma.$transaction(async (tx) => {
    const updated = await repo.updateTransaction(
      transactionId,
      { status: "RELEASED" },
      tx,
    );

    const expiresAt =
      transaction.licenseType === "TIME_LIMITED"
        ? new Date(Date.now() + TIME_LIMITED_LICENSE_DAYS * 24 * 60 * 60 * 1000)
        : null;

    await repo.createLicense(
      {
        transactionId,
        buyerId: transaction.buyerId,
        datasetId: transaction.datasetId,
        licenseKind: transaction.licenseType,
        expiresAt,
        state: "ACTIVE",
      },
      tx,
    );

    return updated;
  });
}

// ---------- Disputes ----------

async function raiseDispute(userId, transactionId, reason) {
  const transaction = await repo.findTransactionById(transactionId);
  if (!transaction) {
    const err = new Error("Transaction not found");
    err.status = 404;
    throw err;
  }
  if (transaction.buyerId !== userId && transaction.farmerId !== userId) {
    const err = new Error("You're not a party to this transaction");
    err.status = 403;
    throw err;
  }
  if (!["PAID", "RELEASED"].includes(transaction.status)) {
    const err = new Error("Only paid or released transactions can be disputed");
    err.status = 409;
    throw err;
  }

  return prisma.$transaction(async (tx) => {
    await repo.createDispute(
      { transactionId, raisedById: userId, reason, status: "OPEN" },
      tx,
    );
    return repo.updateTransaction(transactionId, { status: "DISPUTED" }, tx);
  });
}

// ---------- Payouts ----------

async function getPayoutBalance(farmerId) {
  const unpaid = await repo.findReleasedUnpaidByFarmer(farmerId);
  return unpaid.reduce((sum, t) => sum + Number(t.amount), 0);
}

function shapePayout(p) {
  return {
    id: p.id,
    amount: Number(p.amount),
    method: p.method,
    status: p.status.toLowerCase(),
    reference: p.reference,
    date: p.createdAt,
  };
}

async function requestPayout(farmerId, method) {
  const payout = await prisma.$transaction(async (tx) => {
    const unpaid = await repo.findReleasedUnpaidByFarmer(farmerId, tx);
    const amount = unpaid.reduce((sum, t) => sum + Number(t.amount), 0);

    if (amount <= 0) {
      const err = new Error("No available balance to withdraw");
      err.status = 400;
      throw err;
    }

    const created = await repo.createPayout(
      {
        farmerId,
        amount,
        method,
        status: "PENDING",
        reference: generateReference(),
      },
      tx,
    );

    await repo.claimTransactionsForPayout(
      unpaid.map((t) => t.id),
      created.id,
      tx,
    );

    return created;
  });

  return shapePayout(payout);
}

async function listMyPayouts(farmerId) {
  const payouts = await repo.findPayoutsByFarmer(farmerId);
  return payouts.map(shapePayout);
}

// ---------- Listing (mine) ----------

function shapeTransactionForBuyer(t) {
  return {
    id: t.id,
    licenseId: t.license?.id || null,
    reviewId: t.review?.id || null,
    datasetTitle: t.dataset.title,
    sellerName:
      t.farmer.farmerProfile?.farmName ||
      t.farmer.farmerProfile?.fullName ||
      "Unknown seller",
    licenseType: fromEnumCase(t.licenseType),
    amount: Number(t.amount),
    status: t.status.toLowerCase(),
    date: t.createdAt,
  };
}

function shapeTransactionForFarmer(t) {
  return {
    id: t.id,
    licenseId: t.license?.id || null,
    reviewId: t.review?.id || null,
    datasetTitle: t.dataset.title,
    buyerName:
      t.buyer.buyerProfile?.organizationName ||
      t.buyer.buyerProfile?.contactName ||
      "Unknown buyer",
    licenseType: fromEnumCase(t.licenseType),
    amount: Number(t.amount),
    status: t.status.toLowerCase(),
    date: t.createdAt,
  };
}

async function listMyTransactions(userId, role) {
  if (role === "BUYER") {
    const txns = await repo.findTransactionsByBuyer(userId);
    return txns.map(shapeTransactionForBuyer);
  }
  const txns = await repo.findTransactionsByFarmer(userId);
  return txns.map(shapeTransactionForFarmer);
}

function shapeLicense(l) {
  const now = new Date();
  let state = l.state;
  if (state === "ACTIVE" && l.expiresAt && l.expiresAt < now) {
    state = "EXPIRED"; // computed, not persisted — a background job could sync this later
  }

  return {
    id: l.id,
    datasetTitle: l.dataset.title,
    sellerName:
      l.dataset.farmer.farmerProfile?.farmName ||
      l.dataset.farmer.farmerProfile?.fullName ||
      "Unknown seller",
    licenseKind: fromEnumCase(l.licenseKind),
    grantedDate: l.grantedAt,
    expiryDate: l.expiresAt,
    state: state.toLowerCase(),
  };
}

async function listMyLicenses(buyerId) {
  const licenses = await repo.findLicensesByBuyer(buyerId);
  return licenses.map(shapeLicense);
}

async function authorizeLicenseDownload(buyerId, licenseId) {
  const license = await repo.findLicenseForDownload(licenseId, buyerId);
  if (!license) {
    const err = new Error("License not found");
    err.status = 404;
    throw err;
  }

  if (license.state === "USED") {
    const err = new Error("This one-time license has already been used");
    err.status = 409;
    throw err;
  }

  if (license.state !== "ACTIVE") {
    const err = new Error("This license is not active");
    err.status = 403;
    throw err;
  }

  if (license.expiresAt && license.expiresAt <= new Date()) {
    const err = new Error("This license has expired");
    err.status = 403;
    throw err;
  }

  if (!license.dataset.filePath) {
    const err = new Error("The dataset file is not available");
    err.status = 404;
    throw err;
  }

  return {
    filePath: license.dataset.filePath,
    fileName: license.dataset.title,
    oneTime: license.licenseKind === "ONE_TIME",
  };
}

async function createReview(buyerId, transactionId, rating, comment) {
  const transaction = await repo.findTransactionById(transactionId);
  if (!transaction) {
    const err = new Error("Transaction not found");
    err.status = 404;
    throw err;
  }
  if (transaction.buyerId !== buyerId) {
    const err = new Error("You can only review your own purchases");
    err.status = 403;
    throw err;
  }
  if (transaction.status !== "RELEASED") {
    const err = new Error("Only completed transactions can be reviewed");
    err.status = 409;
    throw err;
  }
  if (await repo.findReviewByTransaction(transactionId)) {
    const err = new Error("This transaction has already been reviewed");
    err.status = 409;
    throw err;
  }

  return repo.createReview({
    transactionId,
    datasetId: transaction.datasetId,
    buyerId,
    farmerId: transaction.farmerId,
    rating,
    comment: comment || null,
  });
}

async function farmerReputation(farmerId) {
  const reviews = await repo.findReviewsByFarmer(farmerId);
  const breakdown = [5, 4, 3, 2, 1].map(
    (rating) => reviews.filter((review) => review.rating === rating).length,
  );
  const total = reviews.length;
  const average = total
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
    : 0;

  return {
    averageRating: Number(average.toFixed(1)),
    totalRatings: total,
    ratingBreakdown: breakdown,
    reviews: reviews.map((review) => ({
      id: review.id,
      buyerName:
        review.buyer.buyerProfile?.organizationName ||
        review.buyer.buyerProfile?.contactName ||
        "Unknown buyer",
      datasetTitle: review.dataset.title,
      rating: review.rating,
      comment: review.comment,
      date: review.createdAt,
    })),
  };
}

module.exports = {
  purchaseListing,
  payTransaction,
  releaseTransaction,
  raiseDispute,
  getPayoutBalance,
  requestPayout,
  listMyPayouts,
  listMyTransactions,
  listMyLicenses,
  authorizeLicenseDownload,
  markLicenseUsed: repo.markLicenseUsed,
  createReview,
  farmerReputation,
};
