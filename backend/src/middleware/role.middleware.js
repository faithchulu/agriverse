/**
 * Usage: router.post("/datasets", authMiddleware, requireRole("FARMER"), controller.create)
 * Must run after authMiddleware, which sets req.user.
 */
function requireRole(...allowedRoles) {
  return function (req, res, next) {
    if (!req.user) {
      const err = new Error("Not authenticated");
      err.status = 401;
      return next(err);
    }
    if (!allowedRoles.includes(req.user.role)) {
      const err = new Error("You don't have permission to do that");
      err.status = 403;
      return next(err);
    }
    next();
  };
}

module.exports = requireRole;