const prisma = require("../../config/db");

const PROFILE_INCLUDE = { farmerProfile: true, buyerProfile: true };

function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    include: PROFILE_INCLUDE,
  });
}

function findById(id) {
  return prisma.user.findUnique({
    where: { id },
    include: PROFILE_INCLUDE,
  });
}

function createFarmer({ email, passwordHash, fullName, farmName, farmLocation, phone }) {
  return prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "FARMER",
      farmerProfile: {
        create: { fullName, farmName, farmLocation, phone },
      },
    },
    include: PROFILE_INCLUDE,
  });
}

function createBuyer({ email, passwordHash, contactName, organizationName, organizationType, phone }) {
  return prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "BUYER",
      buyerProfile: {
        create: { contactName, organizationName, organizationType, phone },
      },
    },
    include: PROFILE_INCLUDE,
  });
}

module.exports = { findByEmail, findById, createFarmer, createBuyer };