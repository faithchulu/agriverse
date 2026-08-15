const { z } = require("zod");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");

const registerSchema = z.preprocess((data) => {
  if (data && typeof data === "object" && typeof data.role === "string") {
    return { ...data, role: data.role.toUpperCase() };
  }
  return data;
}, z.discriminatedUnion("role", [
  z.object({
    role: z.literal("FARMER"),
    email: z.string().email(),
    password: passwordSchema,
    fullName: z.string().min(1, "Full name is required"),
    farmName: z.string().optional(),
    farmLocation: z.string().optional(),
    phone: z.string().optional(),
  }),
  z.object({
    role: z.literal("BUYER"),
    email: z.string().email(),
    password: passwordSchema,
    contactName: z.string().min(1, "Contact name is required"),
    organizationName: z.string().optional(),
    organizationType: z.string().optional(),
    phone: z.string().optional(),
  }),
]));

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

module.exports = { registerSchema, loginSchema };