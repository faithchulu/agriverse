const bcrypt = require("bcryptjs");
const repo = require("./user.repository");

const SALT_ROUNDS = 10;

function sanitizeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

async function updateProfile(userId, role, input) {
  if (input.email) {
    const existing = await repo.findByEmailExcluding(input.email, userId);
    if (existing) {
      const err = new Error("Another account already uses this email");
      err.status = 409;
      throw err;
    }
    await repo.updateEmail(userId, input.email);
  }

  if (role === "FARMER") {
    await repo.updateFarmerProfile(userId, {
      fullName: input.fullName,
      farmName: input.farmName,
      farmLocation: input.farmLocation,
      phone: input.phone,
      bio: input.bio,
    });
  } else {
    await repo.updateBuyerProfile(userId, {
      contactName: input.contactName,
      organizationName: input.organizationName,
      organizationType: input.organizationType,
      phone: input.phone,
      bio: input.bio,
    });
  }

  const updated = await repo.findRawById(userId);
  return sanitizeUser(updated);
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await repo.findRawById(userId);

  const matches = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!matches) {
    const err = new Error("Current password is incorrect");
    err.status = 401;
    throw err;
  }

  const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await repo.updatePasswordHash(userId, newHash);
  return { message: "Password updated" };
}

module.exports = { updateProfile, changePassword };