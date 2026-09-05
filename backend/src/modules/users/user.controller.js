const asyncHandler = require("../../utils/asynchandler");
const { success } = require("../../utils/response");
const service = require("./user.service");

const updateProfile = asyncHandler(async (req, res) => {
  const user = await service.updateProfile(
    req.user.id,
    req.user.role,
    req.body,
  );
  success(res, user);
});

const changePassword = asyncHandler(async (req, res) => {
  const result = await service.changePassword(
    req.user.id,
    req.body.currentPassword,
    req.body.newPassword,
  );
  success(res, result);
});

module.exports = { updateProfile, changePassword };
