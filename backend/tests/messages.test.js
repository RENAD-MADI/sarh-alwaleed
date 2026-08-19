import './setup.js';
import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app, startTestDb, stopTestDb, clearDb, loginCookie } from './helpers.js';
import Message from '../src/models/Message.js';

before(startTestDb);
after(stopTestDb);
beforeEach(clearDb);

const validMessage = {
  name: 'Test User',
  phone: '0500000000',
  subject: 'Test Subject',
  message: 'Test message body.',
};

test('the public contact form stores a message', async () => {
  const res = await request(app).post('/message/addMessage').send(validMessage);

  assert.equal(res.status, 201);
  // The frontend branches on this exact string.
  assert.equal(res.body.message, 'Message Sent successfully');
  assert.equal(await Message.countDocuments(), 1);
});

test('the contact form accepts the capitalised Email field the site sends', async () => {
  const res = await request(app)
    .post('/message/addMessage')
    .send({ ...validMessage, Email: 'user@example.com' });

  assert.equal(res.status, 201);
  const stored = await Message.findOne().lean();
  assert.equal(stored.email, 'user@example.com');
});

test('the contact form rejects a malformed phone number', async () => {
  const res = await request(app)
    .post('/message/addMessage')
    .send({ ...validMessage, phone: '12345' });

  assert.equal(res.status, 400);
  assert.ok(res.body.errors.phone);
  assert.equal(await Message.countDocuments(), 0);
});

test('reading messages requires authentication', async () => {
  await Message.create(validMessage);

  const res = await request(app).get('/message');
  assert.equal(res.status, 401);
  assert.equal(res.body.messages, undefined);
});

test('an authenticated admin can read messages', async () => {
  await Message.create(validMessage);
  const cookie = await loginCookie(request);

  const res = await request(app).get('/message').set('Cookie', cookie);
  assert.equal(res.status, 200);
  assert.equal(res.body.messages.length, 1);
  assert.equal(res.body.messages[0].name, validMessage.name);
});
