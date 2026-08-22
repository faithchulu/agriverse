// Frontend sends values like "one-time" / "time-limited" / "farmer";
// Prisma enums are ONE_TIME / TIME_LIMITED / FARMER. This normalizes
// any string field to match before Zod's enum/literal check runs.
function toEnumCase(value) {
  return typeof value === "string"
    ? value.toUpperCase().replace(/-/g, "_")
    : value;
}

// The reverse — for shaping API responses back into what the frontend's
// TypeScript types expect (e.g. licenseType: "one-time", not "ONE_TIME").
function fromEnumCase(value) {
  return typeof value === "string"
    ? value.toLowerCase().replace(/_/g, "-")
    : value;
}

module.exports = { toEnumCase, fromEnumCase };