const { z } = require("zod");
const { toEnumCase } = require("../../utils/normalize");

const browseListingsQuerySchema = z.object({
  search: z.string().optional(),
  cropType: z.string().optional(),
  licenseType: z
    .preprocess(toEnumCase, z.enum(["ONE_TIME", "TIME_LIMITED", "RESEARCH_ONLY"]))
    .optional(),
  sort: z.enum(["newest", "price_asc", "price_desc"]).default("newest"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

module.exports = { browseListingsQuerySchema };