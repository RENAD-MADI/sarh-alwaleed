import './setup.js';
import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app, startTestDb, stopTestDb, clearDb, loginCookie } from './helpers.js';
import ResidentialContract from '../src/models/ResidentialContract.js';

before(startTestDb);
after(stopTestDb);
beforeEach(clearDb);

const validContract = {
  ownerName: 'Test Owner',
  ownerID: '1000000000',
  ownerPhone: '0500000000',
  clientName: 'Test Tenant',
  clientIDNumber: '1000000001',
  clientPhone: '0500000001',
  unitPrice: '35000',
};

test('a residential contract can be submitted without a login', async () => {
  const res = await request(app).post('/realEsate/add').field(validContract);

  assert.equal(res.status, 201);
  // The frontend branches on this exact string.
  assert.equal(res.body.message, 'Data Added Successfully');
  assert.equal(await ResidentialContract.countDocuments(), 1);
});

test('the submit response does not echo back the submitted PII', async () => {
  const res = await request(app).post('/realEsate/add').field(validContract);

  const body = JSON.stringify(res.body);
  assert.ok(!body.includes(validContract.ownerID));
  assert.ok(!body.includes(validContract.clientIDNumber));
});

test('an invalid national ID is rejected', async () => {
  const res = await request(app)
    .post('/realEsate/add')
    .field({ ...validContract, ownerID: '99' });

  assert.equal(res.status, 400);
  assert.ok(res.body.errors.ownerID);
  assert.equal(await ResidentialContract.countDocuments(), 0);
});

test('a client cannot set the contract status on submit', async () => {
  await request(app).post('/realEsate/add').field({ ...validContract, status: 'issued' });

  const stored = await ResidentialContract.findOne().lean();
  assert.equal(stored.status, 'pending');
});

test('an executable upload is rejected', async () => {
  const res = await request(app)
    .post('/realEsate/add')
    .field(validContract)
    .attach('owner', Buffer.from('MZ fake executable'), {
      filename: 'payload.exe',
      contentType: 'application/x-msdownload',
    });

  assert.equal(res.status, 400);
  assert.match(res.body.message, /JPEG, PNG or PDF/);
});

test('an accepted upload is stored behind an authenticated URL', async () => {
  const res = await request(app)
    .post('/realEsate/add')
    .field(validContract)
    .attach('owner', Buffer.from('fake png bytes'), {
      filename: 'id.png',
      contentType: 'image/png',
    });

  assert.equal(res.status, 201);
  const stored = await ResidentialContract.findOne().lean();
  assert.equal(stored.ownerImage.length, 1);
  assert.match(stored.ownerImage[0].secure_url, /^\/uploads\//);
  // The attacker-controlled original filename must not become the stored name.
  assert.ok(!stored.ownerImage[0].filename.includes('id.png'));

  const anonymous = await request(app).get(stored.ownerImage[0].secure_url);
  assert.equal(anonymous.status, 401);
});

test('listing and paging contracts requires authentication', async () => {
  await ResidentialContract.create(validContract);

  assert.equal((await request(app).get('/realEsate')).status, 401);
  assert.equal((await request(app).get('/realEsate/page?page=1')).status, 401);
  assert.equal((await request(app).get('/realEsate/000000000000000000000000')).status, 401);
});

test('the list endpoint returns counts without leaking contract fields', async () => {
  await ResidentialContract.create(validContract);
  const cookie = await loginCookie(request);

  const res = await request(app).get('/realEsate').set('Cookie', cookie);
  assert.equal(res.status, 200);
  assert.equal(res.body.totalItems, 1);
  assert.equal(res.body.data[0].ownerID, undefined);
});

test('paging returns full records and correct page metadata', async () => {
  await ResidentialContract.create(validContract);
  await ResidentialContract.create({ ...validContract, ownerName: 'Test Owner Two' });
  const cookie = await loginCookie(request);

  const res = await request(app).get('/realEsate/page?page=1').set('Cookie', cookie);
  assert.equal(res.status, 200);
  assert.equal(res.body.data.length, 1);
  assert.equal(res.body.pagination.totalItems, 2);
  assert.equal(res.body.pagination.totalPages, 2);
  assert.equal(res.body.data[0].ownerID, validContract.ownerID);
});

test('a bad page parameter is rejected', async () => {
  const cookie = await loginCookie(request);

  const res = await request(app).get('/realEsate/page?page=0').set('Cookie', cookie);
  assert.equal(res.status, 400);
});

test('an admin can move a contract through its status workflow', async () => {
  const doc = await ResidentialContract.create(validContract);
  const cookie = await loginCookie(request);

  const res = await request(app)
    .patch(`/realEsate/${doc._id}/status`)
    .set('Cookie', cookie)
    .send({ status: 'issued' });

  assert.equal(res.status, 200);
  assert.equal(res.body.data.status, 'issued');
});

test('an unknown status value is rejected', async () => {
  const doc = await ResidentialContract.create(validContract);
  const cookie = await loginCookie(request);

  const res = await request(app)
    .patch(`/realEsate/${doc._id}/status`)
    .set('Cookie', cookie)
    .send({ status: 'whatever' });

  assert.equal(res.status, 400);
});
