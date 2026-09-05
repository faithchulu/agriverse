const prisma = require("../../config/db");

const SELLER_INCLUDE = {
  farmer: {
    select: {
      id: true,
      farmerProfile: { select: { fullName: true, farmName: true } },
    },
  },
};

function buildWhere({ search, cropType, licenseType }) {
  const where = { status: "LIVE" };

  if (cropType) {
    where.cropType = { equals: cropType, mode: "insensitive" };
  }
  if (licenseType) {
    where.licenseType = licenseType;
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { region: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
}

function buildOrderBy(sort) {
  if (sort === "price_asc") return { price: "asc" };
  if (sort === "price_desc") return { price: "desc" };
  return { createdAt: "desc" };
}

async function findLiveListings(
  { search, cropType, licenseType, sort, page, limit },
  buyerId,
) {
  const where = buildWhere({ search, cropType, licenseType });

  const [items, total] = await Promise.all([
    prisma.dataset.findMany({
      where,
      include: SELLER_INCLUDE,
      orderBy: buildOrderBy(sort),
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.dataset.count({ where }),
  ]);

  let purchasedDatasetIds = new Set();
  if (buyerId && items.length > 0) {
    const purchases = await prisma.transaction.findMany({
      where: {
        buyerId,
        datasetId: { in: items.map((item) => item.id) },
      },
      select: { datasetId: true },
    });
    purchasedDatasetIds = new Set(
      purchases.map((purchase) => purchase.datasetId),
    );
  }

  return { items, total, purchasedDatasetIds };
}

function findLiveById(id) {
  return prisma.dataset.findFirst({
    where: { id, status: "LIVE" },
    include: SELLER_INCLUDE,
  });
}

function findTransactionByBuyerAndDataset(buyerId, datasetId) {
  return prisma.transaction.findFirst({
    where: { buyerId, datasetId },
    select: { id: true },
  });
}

// Batched — one query for every farmer in a result set, not one per row.
function averageRatingsByFarmer(farmerIds) {
  return prisma.review.groupBy({
    by: ["farmerId"],
    where: { farmerId: { in: farmerIds } },
    _avg: { rating: true },
    _count: { rating: true },
  });
}

module.exports = {
  findLiveListings,
  findLiveById,
  findTransactionByBuyerAndDataset,
  averageRatingsByFarmer,
};
