const logger = require("../utils/logger");
const { error } = require("../utils/response");

function errorMiddleware(err, req, res, next) {
  logger.error(err.message, err.stack);

  // Prisma "record not found" style errors
  if (err.code === "P2025") {
    return error(res, "Resource not found", 404);
  }
  // Prisma unique constraint violations
  if (err.code === "P2002") {
    return error(res, `Duplicate value for: ${err.meta?.target}`, 409);
  }

  const status = err.status || 500;
  const message =
    status === 500 ? "Something went wrong" : err.message || "Request failed";

  return error(res, message, status, err.details);
}

function notFoundMiddleware(req, res) {
  return error(res, `No route for ${req.method} ${req.originalUrl}`, 404);
}

module.exports = { errorMiddleware, notFoundMiddleware };