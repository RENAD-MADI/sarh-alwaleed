import './setup.js';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import AdminUser from '../src/models/AdminUser.js';

let mongoServer;

export async function startTestDb() {
  mongoServer = await MongoMemoryServer.create();
  mongoose.set('bufferCommands', false);
  await mongoose.connect(mongoServer.getUri());
}

export async function stopTestDb() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer?.stop();
}

export async function clearDb() {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
}

export const app = createApp();

export const ADMIN = {
  name: 'Test Admin',
  email: 'admin@example.com',
  password: 'not-a-real-password-fixture',
};

export async function createAdmin(overrides = {}) {
  return AdminUser.create({
    name: ADMIN.name,
    email: ADMIN.email,
    role: 'admin',
    passwordHash: await AdminUser.hashPassword(ADMIN.password),
    ...overrides,
  });
}

/** Logs in and returns the Set-Cookie value for authenticated requests. */
export async function loginCookie(request) {
  await createAdmin();
  const res = await request(app)
    .post('/auth/login')
    .send({ email: ADMIN.email, password: ADMIN.password });
  return res.headers['set-cookie'];
}
