const { z } = require("zod");

const raiseDisputeSchema = z.object({
  reason: z.string().min(10, "Please describe the issue in a bit more detail"),
});

const requestPayoutSchema = z.object({
  method: z.string().min(1, "Payout method is required"),
});

const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

module.exports = {
  raiseDisputeSchema,
  requestPayoutSchema,
  createReviewSchema,
};
