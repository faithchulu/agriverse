const prisma = require("../../config/db");

function create(data) {
  return prisma.dataset.create({ data });
}

function findById(id) {
  return prisma.dataset.findUnique({ where: { id } });
}

function findManyByFarmer(farmerId) {
  return prisma.dataset.findMany({
    where: { farmerId },
    orderBy: { createdAt: "desc" },
  });
}

function update(id, data) {
  return prisma.dataset.update({ where: { id }, data });
}

function remove(id) {
  return prisma.dataset.delete({ where: { id } });
}

module.exports = { create, findById, findManyByFarmer, update, remove };