const express = require("express");
const controller = require("./auth.controller");
const validate = require("../../middleware/validate.middleware");
const authMiddleware = require("../../middleware/auth.middleware");
const { registerSchema, loginSchema } = require("./auth.validation");

const router = express.Router();

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.get("/me", authMiddleware, controller.me);

module.exports = router;