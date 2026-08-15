const asyncHandler = require("../../utils/asyncHandler");
const { success } = require("../../utils/response");
const service = require("./auth.service");

const register = asyncHandler(async (req, res) => {
  const result = await service.register(req.body);
  success(res, result, 201);
});

const login = asyncHandler(async (req, res) => {
  const result = await service.login(req.body);
  success(res, result);
});

const me = asyncHandler(async (req, res) => {
  const user = await service.getCurrentUser(req.user.id);
  success(res, user);
});

module.exports = { register, login, me };