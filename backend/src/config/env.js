import crypto from 'node:crypto';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

dotenv.config({ path: path.join(projectRoot, '.env') });

/**
 * Reads a required variable. In production a missing value is fatal: we would
 * rather fail at boot than run with a default secret that anyone can guess.
 */
function required(name, devFallback) {
  const value = process.env[name];
  if (value) return value;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env and fill it in.`
    );
  }
  if (devFallback === undefined) {
    throw new Error(`Missing required environment variable ${name}.`);
  }
  return devFallback;
}

function toInt(value, fallback) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toList(value) {
  return (value ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  get isProduction() {
    return this.nodeEnv === 'production';
  },
  get isTest() {
    return this.nodeEnv === 'test';
  },

  port: toInt(process.env.PORT, 5000),
  host: process.env.HOST || '0.0.0.0',

  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sarh_alwaleed',

  // No fixed fallback: a secret committed to the repository would let anyone
  // forge a session. Development gets a random one that dies with the process
  // (so restarting invalidates existing dev sessions, which is intended).
  jwtSecret: required('JWT_SECRET', crypto.randomBytes(48).toString('hex')),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  cookieName: process.env.COOKIE_NAME || 'sarh_admin_token',

  // Empty list => same-origin only (the API also serves the static site).
  corsOrigins: toList(process.env.CORS_ORIGINS),

  uploadDir: process.env.UPLOAD_DIR || path.join(projectRoot, 'uploads'),
  maxUploadBytes: toInt(process.env.MAX_UPLOAD_BYTES, 5 * 1024 * 1024),
  maxFilesPerField: toInt(process.env.MAX_FILES_PER_FIELD, 5),

  // Serve the static site from the API process. Keeps admin pages behind the
  // same origin as the cookie that protects them.
  serveFrontend: (process.env.SERVE_FRONTEND ?? 'true') !== 'false',
  frontendDir: process.env.FRONTEND_DIR || path.resolve(projectRoot, '../frontend'),

  seedAdminEmail: process.env.SEED_ADMIN_EMAIL || '',
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || '',

  projectRoot,
};

export default env;
