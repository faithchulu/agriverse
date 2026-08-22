const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const UPLOAD_DIR = path.join(__dirname, "..", "..", "..", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(8).toString("hex");
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${unique}-${safeName}`);
  },
});

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
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

module.exports = { uploadDatasetFile, UPLOAD_DIR };