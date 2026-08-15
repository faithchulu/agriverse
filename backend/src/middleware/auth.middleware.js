const { verifyToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    const err = new Error("Missing or malformed Authorization header");
    err.status = 401;
    return next(err);
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (e) {
    const err = new Error("Invalid or expired token");
    err.status = 401;
    next(err);
  }
}

module.exports = authMiddleware;