const express = require("express");
const controller = require("./user.controller");
const validate = require("../../middleware/validate.middleware");
const authMiddleware = require("../../middleware/auth.middleware");
const { updateProfileSchema, changePasswordSchema } = require("./user.validation");

const router = express.Router();

router.use(authMiddleware);

router.put("/me/profile", validate(updateProfileSchema), controller.updateProfile);
router.put("/me/password", validate(changePasswordSchema), controller.changePassword);

module.exports = router;