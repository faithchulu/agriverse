const fs = require("fs/promises");
const repo = require("./dataset.repository");
const { hashFile } = require("../../utils/hash");
const { fromEnumCase } = require("../../utils/normalize");
const logger = require("../../utils/logger");

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
    filePath = file.path;
    fileHash = await hashFile(file.path);
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
      await fs.unlink(dataset.filePath);
    } catch (e) {
      // Non-fatal — the DB row is the source of truth; a leftover file
      // on disk is a cleanup nuisance, not a correctness problem.
      logger.warn("Failed to delete dataset file on disk:", e.message);
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