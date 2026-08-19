/**
 * Creates or updates a staff account.
 *
 *   npm run create-admin -- --email you@example.com --password "..." --name "..." --role admin
 *
 * Credentials are read from flags or SEED_ADMIN_* env vars. Nothing is
 * hard-coded: there is no default account to forget about in production.
 */
import env from '../config/env.js';
import logger from '../utils/logger.js';
import AdminUser from '../models/AdminUser.js';
import { connectDatabase, disconnectDatabase } from '../db/connect.js';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (!argv[i].startsWith('--')) continue;
    args[argv[i].slice(2)] = argv[i + 1];
    i += 1;
  }
  return args;
}

const MIN_PASSWORD_LENGTH = 12;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const email = (args.email || env.seedAdminEmail || '').trim().toLowerCase();
  const password = args.password || env.seedAdminPassword || '';
  const name = args.name || 'Administrator';
  const role = args.role === 'staff' ? 'staff' : 'admin';

  if (!email || !password) {
    throw new Error(
      'Email and password are required. Pass --email and --password, ' +
        'or set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env'
    );
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  await connectDatabase();

  const passwordHash = await AdminUser.hashPassword(password);
  const user = await AdminUser.findOneAndUpdate(
    { email },
    { $set: { name, role, passwordHash, isActive: true } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  logger.info('Admin account ready', { email: user.email, role: user.role });
  await disconnectDatabase();
}

main().catch(async (err) => {
  logger.error('createAdmin failed', { message: err.message });
  await disconnectDatabase().catch(() => {});
  process.exit(1);
});
