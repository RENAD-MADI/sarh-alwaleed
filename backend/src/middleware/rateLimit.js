import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

// Tests would otherwise trip the limiter while exercising a single endpoint.
const skip = () => env.isTest;

/** Broad ceiling applied to the whole API. */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip,
  message: { success: false, message: 'Too many requests, please try again later' },
});

/** Contract and contact submissions: slow enough to stop scripted spam. */
export const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip,
  message: {
    success: false,
    message: 'Too many submissions from this address, please try again later',
  },
});

/** Login: tight, to make credential stuffing impractical. */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skip,
  message: { success: false, message: 'Too many login attempts, please try again later' },
});
