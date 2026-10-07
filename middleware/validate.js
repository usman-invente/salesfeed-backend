export const validate = (schema) => (req, res, next) => {
  try {
    // .parse throws a ZodError automatically if validation fails
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    // Pass the ZodError straight to global errorHandler
    next(err);
  }
};