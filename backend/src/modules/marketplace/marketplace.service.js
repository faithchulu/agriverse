const repo = require("./marketplace.repository");
const { fromEnumCase } = require("../../utils/normalize");

function sellerName(farmer) {
  const profile = farmer.farmerProfile;
  return profile?.farmName || profile?.fullName || "Unknown seller";
}

// Deliberately whitelists fields — never spread the raw Prisma row, since
// that would leak filePath (a server disk path) to public API consumers.
function shapeListing(
  dataset,
  ratingByFarmer,
  purchasedDatasetIds,
  savedDatasetIds = new Set(),
) {
  const rating = ratingByFarmer.get(dataset.farmerId);

  return {
    id: dataset.id,
    title: dataset.title,
    cropType: dataset.cropType,
    region: dataset.region,
    price: Number(dataset.price),
    licenseType: fromEnumCase(dataset.licenseType),
    sellerId: dataset.farmerId,
    sellerName: sellerName(dataset.farmer),
    sellerRating: rating ? Number(rating._avg.rating.toFixed(1)) : 0,
    sellerRatingCount: rating ? rating._count.rating : 0,
    purchased: purchasedDatasetIds.has(dataset.id),
    saved: savedDatasetIds.has(dataset.id),
    uploadedDate: dataset.createdAt,
  };
}

function shapeListingDetail(dataset, ratingByFarmer, purchasedDatasetIds) {
  return {
    ...shapeListing(dataset, ratingByFarmer, purchasedDatasetIds),
    description: dataset.description,
    samplingMethod: dataset.samplingMethod,
    sampleDateFrom: dataset.sampleDateFrom,
    sampleDateTo: dataset.sampleDateTo,
    fileHash: dataset.fileHash, // integrity reference, safe to expose — not a path
  };
}

async function ratingMapFor(datasets) {
  const farmerIds = [...new Set(datasets.map((d) => d.farmerId))];
  if (farmerIds.length === 0) return new Map();
  const ratings = await repo.averageRatingsByFarmer(farmerIds);
  return new Map(ratings.map((r) => [r.farmerId, r]));
}

async function browseListings(filters, buyerId) {
  const { items, total, purchasedDatasetIds, savedDatasetIds } =
    await repo.findLiveListings(filters, buyerId);
  const ratingByFarmer = await ratingMapFor(items);

  return {
    items: items.map((d) =>
      shapeListing(d, ratingByFarmer, purchasedDatasetIds, savedDatasetIds),
    ),
    total,
    page: filters.page,
    limit: filters.limit,
  };
}

function shapeSavedListing(saved) {
  const listing = saved.dataset;
  const profile = listing.farmer.farmerProfile;
  return {
    id: listing.id,
    title: listing.title,
    cropType: listing.cropType,
    region: listing.region,
    price: Number(listing.price),
    licenseType: fromEnumCase(listing.licenseType),
    sellerId: listing.farmerId,
    sellerName: profile?.farmName || profile?.fullName || "Unknown seller",
    uploadedDate: listing.createdAt,
    savedAt: saved.createdAt,
  };
}

async function listSavedListings(buyerId) {
  const saved = await repo.findSavedListingsByBuyer(buyerId);
  return saved.map(shapeSavedListing);
}

async function saveListing(buyerId, datasetId) {
  const dataset = await repo.findLiveById(datasetId);
  if (!dataset) {
    const err = new Error("Listing not found or no longer available");
    err.status = 404;
    throw err;
  }
  const existing = await repo.findSavedListing(buyerId, datasetId);
  if (!existing) await repo.createSavedListing(buyerId, datasetId);
  return { saved: true };
}

async function removeSavedListing(buyerId, datasetId) {
  const existing = await repo.findSavedListing(buyerId, datasetId);
  if (existing) await repo.deleteSavedListing(buyerId, datasetId);
  return { saved: false };
}

async function getListingDetail(id, buyerId) {
  const dataset = await repo.findLiveById(id);
  if (!dataset) {
    const err = new Error("Listing not found or no longer available");
    err.status = 404;
    throw err;
  }
  const ratingByFarmer = await ratingMapFor([dataset]);
  const purchasedDatasetIds = new Set();
  if (buyerId) {
    const purchase = await repo.findTransactionByBuyerAndDataset(buyerId, id);
    if (purchase) purchasedDatasetIds.add(id);
  }
  return shapeListingDetail(dataset, ratingByFarmer, purchasedDatasetIds);
}

module.exports = {
  browseListings,
  getListingDetail,
  listSavedListings,
  saveListing,
  removeSavedListing,
};
