const { z } = require("zod");

const raiseDisputeSchema = z.object({
  reason: z.string().min(10, "Please describe the issue in a bit more detail"),
});

const requestPayoutSchema = z.object({
  method: z.string().min(1, "Payout method is required"),
});

module.exports = { raiseDisputeSchema, requestPayoutSchema };