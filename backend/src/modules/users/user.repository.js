const prisma = require("../../config/db");

const PROFILE_INCLUDE = { farmerProfile: true, buyerProfile: true };

// Includes passwordHash — for internal use only (password verification).
// Never return the result of this directly from a controller.
function findRawById(id) {
  return prisma.user.findUnique({ where: { id }, include: PROFILE_INCLUDE });
}

function findByEmailExcluding(email, excludeUserId) {
  return prisma.user.findFirst({
    where: { email, NOT: { id: excludeUserId } },
  });
}

function updateEmail(userId, email) {
  return prisma.user.update({ where: { id: userId }, data: { email } });
}

function updatePasswordHash(userId, passwordHash) {
  return prisma.user.update({ where: { id: userId }, data: { passwordHash } });
}

function updateFarmerProfile(userId, data) {
  return prisma.farmerProfile.update({ where: { userId }, data });
}

function updateBuyerProfile(userId, data) {
  return prisma.buyerProfile.update({ where: { userId }, data });
}

module.exports = {
  findRawById,
  findByEmailExcluding,
  updateEmail,
  updatePasswordHash,
  updateFarmerProfile,
  updateBuyerProfile,
};