// Frontend sends values like "one-time" / "time-limited" / "farmer";
// Prisma enums are ONE_TIME / TIME_LIMITED / FARMER. This normalizes
// any string field to match before Zod's enum/literal check runs.
function toEnumCase(value) {
  return typeof value === "string"
    ? value.toUpperCase().replace(/-/g, "_")
    : value;
}

// Wrap a specific field's raw value before it enters the rest of the
// object schema — use inside z.object({ field: z.preprocess(toEnumCase, z.enum([...])) })
module.exports = { toEnumCase };