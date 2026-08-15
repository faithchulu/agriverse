const { PrismaClient } = require("@prisma/client");

// A single shared instance avoids exhausting Postgres connections when
// modules are required repeatedly (especially relevant on serverless,
// where a fresh PrismaClient per invocation would leak connections).
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

module.exports = prisma;