const { z } = require("zod");
const { toEnumCase } = require("../../utils/normalize");

const licenseTypeField = z.preprocess(
  toEnumCase,
  z.enum(["ONE_TIME", "TIME_LIMITED", "RESEARCH_ONLY"]),
);

// DRAFT or LIVE only — WITHDRAWN happens via the dedicated withdraw
// endpoint. Purchases do not change the dataset status.
const createStatusField = z
  .preprocess(toEnumCase, z.enum(["DRAFT", "LIVE"]))
  .default("DRAFT");

const createDatasetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  cropType: z.string().min(1, "Crop type is required"),
  region: z.string().min(1, "Region is required"),
  sampleDateFrom: z.coerce.date().optional(),
  sampleDateTo: z.coerce.date().optional(),
  samplingMethod: z.string().optional(),
  description: z.string().optional(),
  licenseType: licenseTypeField,
  price: z.coerce.number().positive("Price must be greater than 0"),
  status: createStatusField,
});

// Same fields, all optional — used for editing an existing draft/live
// listing. Status here is restricted separately (see dataset.service.js);
// this schema just validates shape.
const updateDatasetSchema = z.object({
  title: z.string().min(1).optional(),
  cropType: z.string().min(1).optional(),
  region: z.string().min(1).optional(),
  sampleDateFrom: z.coerce.date().optional(),
  sampleDateTo: z.coerce.date().optional(),
  samplingMethod: z.string().optional(),
  description: z.string().optional(),
  licenseType: licenseTypeField.optional(),
  price: z.coerce.number().positive("Price must be greater than 0").optional(),
  status: createStatusField.optional(),
});

module.exports = { createDatasetSchema, updateDatasetSchema };
