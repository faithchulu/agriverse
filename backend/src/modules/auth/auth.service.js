const bcrypt = require("bcryptjs");
const repo = require("./auth.repository");
const { signToken } = require("../../utils/jwt");

const SALT_ROUNDS = 10;

function sanitizeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

async function register(input) {
  const existing = await repo.findByEmail(input.email);
  if (existing) {
    const err = new Error("An account with this email already exists");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user =
    input.role === "FARMER"
      ? await repo.createFarmer({ ...input, passwordHash })
      : await repo.createBuyer({ ...input, passwordHash });

  const token = signToken({ sub: user.id, role: user.role });
  return { user: sanitizeUser(user), token };
}

async function login({ email, password }) {
  const user = await repo.findByEmail(email);
  if (!user) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const token = signToken({ sub: user.id, role: user.role });
  return { user: sanitizeUser(user), token };
}

async function getCurrentUser(userId) {
  const user = await repo.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return sanitizeUser(user);
}

module.exports = { register, login, getCurrentUser };