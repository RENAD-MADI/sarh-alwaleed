import multer from 'multer';
import mongoose from 'mongoose';
import env from '../config/env.js';
import logger from '../utils/logger.js';
import ApiError from '../utils/ApiError.js';
import { discardUploads } from './upload.js';

export function notFoundHandler(req, _res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

/**
 * Terminal error handler. Client errors keep their message; anything else is
 * reported generically so stack traces and driver internals never reach the
 * browser. Stacks are logged server-side instead.
 */
export function errorHandler(err, req, res, _next) {
  // A request that failed after multer wrote to disk would otherwise leave
  // orphaned copies of customers' ID scans lying around.
  discardUploads(req.files);

  let statusCode = err.statusCode ?? 500;
  let message = err.message ?? 'Internal server error';
  let details = err.details;

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.fromEntries(
      Object.entries(err.errors).map(([field, e]) => [field, e.message])
    );
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  } else if (err?.code === 11000) {
    statusCode = 409;
    message = 'A record with these details already exists';
  } else if (err instanceof multer.MulterError) {
    statusCode = 400;
  }

  if (statusCode >= 500) {
    logger.error('Unhandled request error', {
      method: req.method,
      path: req.originalUrl,
      stack: err.stack,
    });
    if (env.isProduction) message = 'Internal server error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { errors: details } : {}),
  });
}
