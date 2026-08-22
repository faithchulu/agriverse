const express = require("express");
const controller = require("./dataset.controller");
const validate = require("../../middleware/validate.middleware");
const authMiddleware = require("../../middleware/auth.middleware");
const requireRole = require("../../middleware/role.middleware");
const { uploadDatasetFile } = require("../../middleware/upload.middleware");
const { createDatasetSchema, updateDatasetSchema } = require("./dataset.validation");

const router = express.Router();

router.use(authMiddleware, requireRole("FARMER"));

// multer runs first so req.body is populated from the multipart fields
// before Zod validates it, and req.file holds the uploaded dataset file.
router.post(
  "/mine",
  uploadDatasetFile.single("file"),
  validate(createDatasetSchema),
  controller.create,
);

router.get("/mine", controller.listMine);
router.get("/mine/:id", controller.getMine);
router.put("/mine/:id", validate(updateDatasetSchema), controller.update);
router.patch("/mine/:id/withdraw", controller.withdraw);
router.delete("/mine/:id", controller.remove);

module.exports = router;