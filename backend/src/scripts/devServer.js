/**
 * Runs the full stack against a throwaway in-memory MongoDB.
 *
 * For local demos and manual QA only — all data disappears on exit. Use
 * `npm run dev` against a real MONGODB_URI for anything you want to keep.
 */
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import env from '../config/env.js';
import logger from '../utils/logger.js';
import { createApp } from '../app.js';
import AdminUser from '../models/AdminUser.js';

const DEMO_EMAIL = process.env.DEMO_ADMIN_EMAIL || 'admin@example.com';

/**
 * A fresh random password each run, printed once to the console.
 * Nothing usable is committed, so cloning this repository grants no access.
 */
const DEMO_PASSWORD =
  process.env.DEMO_ADMIN_PASSWORD || crypto.randomBytes(12).toString('base64url');

async function main() {
  if (env.isProduction) {
    throw new Error('devServer uses an in-memory database and must not run in production');
  }

  const memoryServer = await MongoMemoryServer.create();
  mongoose.set('bufferCommands', false);
  await mongoose.connect(memoryServer.getUri());
  logger.info('In-memory MongoDB ready');

  await AdminUser.create({
    name: 'Demo Admin',
    email: DEMO_EMAIL,
    role: 'admin',
    passwordHash: await AdminUser.hashPassword(DEMO_PASSWORD),
  });

  const app = createApp();
  app.listen(env.port, () => {
    logger.info(`Demo stack on http://localhost:${env.port}`);
    logger.info(`Demo login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  });
}

main().catch((err) => {
  logger.error('devServer failed', { message: err.message, stack: err.stack });
  process.exit(1);
});
