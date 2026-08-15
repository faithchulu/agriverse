const { z } = require("zod");

// Superset of both roles' fields — all optional. The service picks the
// role-appropriate subset before writing, so sending buyer fields as a
// farmer (or vice versa) is silently ignored rather than erroring, since
// the frontend forms only ever render the fields relevant to the user's
// own role anyway.
const updateProfileSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  // farmer fields
  fullName: z.string().min(1).optional(),
  farmName: z.string().optional(),
  farmLocation: z.string().optional(),
  // buyer fields
  contactName: z.string().min(1).optional(),
  organizationName: z.string().optional(),
  organizationType: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

module.exports = { updateProfileSchema, changePasswordSchema };