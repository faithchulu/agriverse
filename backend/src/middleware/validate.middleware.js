const { ZodError } = require("zod");

/**
 * Usage: router.post("/register", validate(registerSchema), controller.register)
 * Or for query params: router.get("/listings", validate(querySchema, "query"), controller.list)
 * Replaces req.body (or req.query) with the parsed/coerced result so
 * downstream code can trust its shape.
 */
function validate(schema, source = "body") {
  return function (req, res, next) {
    try {
      req[source] = schema.parse(req[source]);
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
        // Only relevant for source === "body"; query params are always
        // present as an object (possibly empty), so this never fires for them.
        const bodyMissing =
          source === "body" &&
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