const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const env = require("./config/env");
const prisma = require("./config/db");
const asyncHandler = require("./utils/asyncHandler");
const { success } = require("./utils/response");
const { errorMiddleware, notFoundMiddleware } = require("./middleware/error.middleware");

const app = express();

app.use(
  cors({
    origin: env.corsOrigins.length > 0 ? env.corsOrigins : true,
    credentials: true,
  }),
);
app.use(express.json());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ---------- Health checks ----------

app.get("/", (req, res) => {
  success(res, { message: "AgriVerse backend up and running!" });
});

// Confirms the app can actually reach Postgres — hit this after deploying
// or after changing DATABASE_URL to sanity-check the connection.
app.get(
  "/health/db",
  asyncHandler(async (req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    success(res, { database: "connected" });
  }),
);

app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/users", require("./modules/users/user.routes"));

// ---------- Module routes ----------
// Mounted here as each module is built.
//
// app.use("/api/datasets", require("./modules/datasets/dataset.routes"));
// app.use("/api/marketplace", require("./modules/marketplace/marketplace.routes"));
// app.use("/api/payments", require("./modules/payments/payment.routes"));
// app.use("/api/analytics", require("./modules/analytics/analytics.routes"));

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;