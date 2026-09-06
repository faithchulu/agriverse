const multer = require("multer");
const path = require("path");

function fileFilter(req, file, cb) {
  const allowed = [".csv", ".json"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    const err = new Error("Only .csv and .json files are accepted");
    err.status = 400;
    return cb(err);
  }
  cb(null, true);
}

const uploadDatasetFile = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

module.exports = { uploadDatasetFile };
