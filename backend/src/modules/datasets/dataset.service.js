const fs = require("fs/promises");
const repo = require("./dataset.repository");
const { hashFile } = require("../../utils/hash");
const logger = require("../../utils/logger");

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

  return repo.create({
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
}

function listMine(farmerId) {
  return repo.findManyByFarmer(farmerId);
}

async function getMine(farmerId, datasetId) {
  return getOwnedOrThrow(farmerId, datasetId);
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

  return repo.update(datasetId, input);
}

async function withdrawDataset(farmerId, datasetId) {
  const dataset = await getOwnedOrThrow(farmerId, datasetId);

  if (dataset.status !== "LIVE") {
    const err = new Error("Only live listings can be withdrawn");
    err.status = 409;
    throw err;
  }

  return repo.update(datasetId, { status: "WITHDRAWN" });
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