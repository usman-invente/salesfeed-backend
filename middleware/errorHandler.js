import { ZodError } from "zod";

export const errorHandler = (err, req, res, next) => {
  // 1. Check if the error came from Zod Validation
  if (err instanceof ZodError) {
    const formattedErrors = {};

    for (const issue of err.issues) {
      const field = issue.path[0];
      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }

      if (issue.code === "invalid_type" && issue.received === "undefined") {
        formattedErrors[field].push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
      } else {
        formattedErrors[field].push(issue.message);
      }
    }

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
  }

  // 2. Fallback for all other Runtime / Database Errors (500)
  const statusCode = err.statusCode || err.status || 500;

  if (process.env.NODE_ENV !== "production") {
    console.error(`[Error] ${req.method} ${req.url}:`, err.stack || err);
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error.",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};