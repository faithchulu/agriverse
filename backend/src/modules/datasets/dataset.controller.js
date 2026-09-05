const asyncHandler = require("../../utils/asynchandler");
const { success } = require("../../utils/response");
const service = require("./dataset.service");

const create = asyncHandler(async (req, res) => {
  const dataset = await service.createDataset(req.user.id, req.body, req.file);
  success(res, dataset, 201);
});

const listMine = asyncHandler(async (req, res) => {
  const datasets = await service.listMine(req.user.id);
  success(res, datasets);
});

const getMine = asyncHandler(async (req, res) => {
  const dataset = await service.getMine(req.user.id, req.params.id);
  success(res, dataset);
});

const update = asyncHandler(async (req, res) => {
  const dataset = await service.updateDataset(
    req.user.id,
    req.params.id,
    req.body,
  );
  success(res, dataset);
});

const withdraw = asyncHandler(async (req, res) => {
  const dataset = await service.withdrawDataset(req.user.id, req.params.id);
  success(res, dataset);
});

const remove = asyncHandler(async (req, res) => {
  const result = await service.deleteDataset(req.user.id, req.params.id);
  success(res, result);
});

module.exports = { create, listMine, getMine, update, withdraw, remove };
