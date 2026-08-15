const { ZodError } = require("zod");

/**
 * Usage: router.post("/register", validate(registerSchema), controller.register)
 * Replaces req.body with the parsed (and coerced) result so downstream
 * code can trust its shape.
 */
function validate(schema) {
  return function (req, res, next) {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));

        // A root-level "Required"/"invalid_type" issue (empty path) means
        // Express never parsed a body at all — almost always a missing or
        // wrong Content-Type header rather than a real field problem.
        const bodyMissing =
          details.length === 1 &&
          details[0].path === "" &&
          (req.body === undefined || Object.keys(req.body || {}).length === 0);

        const validationError = new Error(
          bodyMissing
            ? "Request body is missing or not valid JSON. Check that Content-Type is application/json (in Postman: Body tab → raw → JSON)."
            : "Validation failed",
        );
        validationError.status = 422;
        validationError.details = bodyMissing ? undefined : details;
        return next(validationError);
      }
      next(err);
    }
  };
}

module.exports = validate;