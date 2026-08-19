import AdminUser from '../models/AdminUser.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';
import { signToken, setAuthCookie, clearAuthCookie } from '../middleware/auth.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await AdminUser.findOne({ email }).select('+passwordHash');

  // Identical response for "no such user", "wrong password" and "deactivated"
  // so the endpoint cannot be used to enumerate staff accounts.
  const invalid = ApiError.unauthorized('Invalid email or password');
  if (!user || !user.isActive) {
    logger.warn('Failed login attempt', { email });
    throw invalid;
  }

  const passwordMatches = await user.verifyPassword(password);
  if (!passwordMatches) {
    logger.warn('Failed login attempt', { email });
    throw invalid;
  }

  user.lastLoginAt = new Date();
  await user.save();

  setAuthCookie(res, signToken(user));
  logger.info('Admin logged in', { id: user._id.toString() });

  res.json({
    success: true,
    message: 'Logged in successfully',
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
});

export const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});
