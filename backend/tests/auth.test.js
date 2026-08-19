import './setup.js';
import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app, startTestDb, stopTestDb, clearDb, createAdmin, ADMIN } from './helpers.js';

before(startTestDb);
after(stopTestDb);
beforeEach(clearDb);

test('login succeeds with valid credentials and sets an httpOnly cookie', async () => {
  await createAdmin();

  const res = await request(app)
    .post('/auth/login')
    .send({ email: ADMIN.email, password: ADMIN.password });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  const cookie = res.headers['set-cookie'].join(';');
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /SameSite=Strict/i);
});

test('login rejects a wrong password without revealing which field was wrong', async () => {
  await createAdmin();

  const res = await request(app)
    .post('/auth/login')
    .send({ email: ADMIN.email, password: 'wrong-password' });

  assert.equal(res.status, 401);
  assert.equal(res.body.message, 'Invalid email or password');
});

test('login gives the same response for an unknown account', async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'nobody@example.com', password: 'not-a-real-password-fixture' });

  assert.equal(res.status, 401);
  assert.equal(res.body.message, 'Invalid email or password');
});

test('a deactivated account cannot log in', async () => {
  await createAdmin({ isActive: false });

  const res = await request(app)
    .post('/auth/login')
    .send({ email: ADMIN.email, password: ADMIN.password });

  assert.equal(res.status, 401);
});

test('login validates the payload', async () => {
  const res = await request(app).post('/auth/login').send({ email: 'not-an-email' });

  assert.equal(res.status, 400);
  assert.equal(res.body.message, 'Validation failed');
});

test('/auth/me requires a session and returns the signed-in user', async () => {
  const anonymous = await request(app).get('/auth/me');
  assert.equal(anonymous.status, 401);

  await createAdmin();
  const login = await request(app)
    .post('/auth/login')
    .send({ email: ADMIN.email, password: ADMIN.password });

  const res = await request(app).get('/auth/me').set('Cookie', login.headers['set-cookie']);
  assert.equal(res.status, 200);
  assert.equal(res.body.data.email, ADMIN.email);
  assert.equal(res.body.data.role, 'admin');
});

test('logout clears the session cookie', async () => {
  const res = await request(app).post('/auth/logout');
  assert.equal(res.status, 200);
  assert.match(res.headers['set-cookie'].join(';'), /sarh_admin_token=;/);
});
