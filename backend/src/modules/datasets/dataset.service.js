const repo = require("./dataset.repository");
const { hashBuffer } = require("../../utils/hash");
const { fromEnumCase } = require("../../utils/normalize");
const logger = require("../../utils/logger");
const storage = require("../storage/storage.service");

// Deliberately whitelists fields — same reasoning as marketplace.service.js:
// never spread the raw Prisma row, since that would leak filePath (a server
// disk path) even to the owning farmer, who has no use for it.
function shapeDataset(dataset) {
  return {
    id: dataset.id,
    title: dataset.title,
    cropType: dataset.cropType,
    region: dataset.region,
    sampleDateFrom: dataset.sampleDateFrom,
    sampleDateTo: dataset.sampleDateTo,
    samplingMethod: dataset.samplingMethod,
    description: dataset.description,
    licenseType: fromEnumCase(dataset.licenseType),
    price: Number(dataset.price),
    status: fromEnumCase(dataset.status),
    fileHash: dataset.fileHash,
    createdAt: dataset.createdAt,
    updatedAt: dataset.updatedAt,
  };
}

async function getOwnedOrThrow(farmerId, datasetId) {
  const dataset = await repo.findById(datasetId);
  if (!dataset) {
    const err = new Error("Dataset not found");
    err.status = 404;
    throw err;
  }
  if (dataset.farmerId !== farmerId) {
    const err = new Error("You don't have access to this dataset");
    err.status = 403;
    throw err;
  }
  return dataset;
}

async function createDataset(farmerId, input, file) {
  let filePath = null;
  let fileHash = null;

  if (file) {
    filePath = await storage.uploadDataset(file);
    fileHash = hashBuffer(file.buffer);
  }

  const created = await repo.create({
    farmerId,
    title: input.title,
    cropType: input.cropType,
    region: input.region,
    sampleDateFrom: input.sampleDateFrom,
    sampleDateTo: input.sampleDateTo,
    samplingMethod: input.samplingMethod,
    description: input.description,
    licenseType: input.licenseType,
    price: input.price,
    status: input.status,
    filePath,
    fileHash,
  });

  return shapeDataset(created);
}

async function listMine(farmerId) {
  const datasets = await repo.findManyByFarmer(farmerId);
  return datasets.map(shapeDataset);
}

async function getMine(farmerId, datasetId) {
  const dataset = await getOwnedOrThrow(farmerId, datasetId);
  return shapeDataset(dataset);
}

async function updateDataset(farmerId, datasetId, input) {
  const dataset = await getOwnedOrThrow(farmerId, datasetId);

  if (dataset.status === "SOLD" || dataset.status === "WITHDRAWN") {
    const err = new Error(
      `A ${dataset.status.toLowerCase()} listing can't be edited`,
    );
    err.status = 409;
    throw err;
  }

  const updated = await repo.update(datasetId, input);
  return shapeDataset(updated);
}

async function withdrawDataset(farmerId, datasetId) {
  const dataset = await getOwnedOrThrow(farmerId, datasetId);

  if (dataset.status !== "LIVE") {
    const err = new Error("Only live listings can be withdrawn");
    err.status = 409;
    throw err;
  }

  const updated = await repo.update(datasetId, { status: "WITHDRAWN" });
  return shapeDataset(updated);
}

async function deleteDataset(farmerId, datasetId) {
  const dataset = await getOwnedOrThrow(farmerId, datasetId);

  if (dataset.status !== "DRAFT") {
    const err = new Error("Only draft listings can be deleted");
    err.status = 409;
    throw err;
  }

  if (dataset.filePath) {
    try {
      await storage.deleteDataset(dataset.filePath);
    } catch (e) {
      logger.warn("Failed to delete dataset object from R2:", e.message);
    }
  }

  await repo.remove(datasetId);
  return { message: "Dataset deleted" };
}

module.exports = {
  createDataset,
  listMine,
  getMine,
  updateDataset,
  withdrawDataset,
  deleteDataset,
};
