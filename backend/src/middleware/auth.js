import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import AdminUser from '../models/AdminUser.js';
import asyncHandler from '../utils/asyncHandler.js';

export function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export function setAuthCookie(res, token) {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    // Same-site strict is safe here: the dashboards are served from this origin.
    sameSite: 'strict',
    secure: env.isProduction,
    maxAge: 8 * 60 * 60 * 1000,
    path: '/',
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    sameSite: 'strict',
    secure: env.isProduction,
    path: '/',
  });
}

/**
 * Rejects the request unless it carries a valid admin cookie.
 * The token is only trusted after the account is re-checked in the database,
 * so deactivating a user takes effect immediately rather than at token expiry.
 */
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[env.cookieName];
  if (!token) throw ApiError.unauthorized();

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw ApiError.unauthorized('Session expired or invalid');
  }

  const user = await AdminUser.findById(payload.sub);
  if (!user || !user.isActive) throw ApiError.unauthorized('Account is no longer active');

  req.user = user;
  next();
});

/** Restricts a route to specific roles. Must run after `requireAuth`. */
export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
    next();
  };
}
