/**
 * Development seed. Inserts a small set of sample records so the dashboards
 * have something to render locally.
 *
 * Refuses to run against NODE_ENV=production: the sample rows use fabricated
 * ID numbers that must never reach a live database.
 */
import env from '../config/env.js';
import logger from '../utils/logger.js';
import Message from '../models/Message.js';
import ResidentialContract from '../models/ResidentialContract.js';
import CommercialContract from '../models/CommercialContract.js';
import SubContract from '../models/SubContract.js';
import { connectDatabase, disconnectDatabase } from '../db/connect.js';

const sampleMessages = [
  {
    name: 'مستخدم تجريبي ١ (Test User 1)',
    phone: '0500000000',
    email: 'test1@example.com',
    subject: 'استفسار عن العقد السكني',
    message: 'أرغب في معرفة الرسوم المطلوبة لإصدار عقد سكني موحد.',
  },
  {
    name: 'مستخدم تجريبي ٢ (Test User 2)',
    phone: '0500000001',
    email: 'test2@example.com',
    subject: 'طلب تسويق عقاري',
    message: 'لدي شقة في الرياض وأرغب في عرضها للإيجار.',
  },
];

const sampleResidential = {
  ownerName: 'مالك تجريبي (Test Owner)',
  ownerID: '1000000000',
  ownerPhone: '0500000002',
  email: 'owner@example.com',
  bankName: 'BANK_NAME_HERE',
  IBAN: 'SA0000000000000000000000',
  district: 'حي تجريبي (Test District)',
  streetName: 'شارع تجريبي (Test Street)',
  clientName: 'مستأجر تجريبي (Test Tenant)',
  clientIDNumber: '1000000001',
  clientPhone: '0500000003',
  clientEmail: 'tenant@example.com',
  unitNum: '12',
  unitFloor: '3',
  unitPrice: '35000',
  unitInsurance: '2000',
  unitContract: '12',
};

const sampleCommercial = {
  ownerID: '1000000002',
  ownerPhone: '0500000004',
  email: 'commercial-owner@example.com',
  commercialName: 'منشأة تجريبية (Test Facility)',
  commercialNumber: '0000000000',
  commercialClientID: '1000000003',
  commercialClientPhone: '0500000005',
  commercialClientEmail: 'commercial-tenant@example.com',
  unitNum: '4',
  unitType: 'معرض',
  unitArea: '120',
  unitPrice: '90000',
};

const sampleSub = {
  contractNum: 'SUB-0001',
  contractType: 'سكني',
  ownerName: 'مؤجر تجريبي (Test Lessor)',
  ownerID: '1000000004',
  ownerPhone: '0500000006',
  clientName: 'مستأجر باطن تجريبي (Test Sublessee)',
  clientID: '1000000005',
  clientPhone: '0500000007',
  unitNum: '7',
  MonthlyPrice: '3000',
  totalContract: '36000',
};

async function main() {
  if (env.isProduction) {
    throw new Error('Refusing to seed sample data while NODE_ENV=production');
  }

  await connectDatabase();

  await Promise.all([
    Message.deleteMany({}),
    ResidentialContract.deleteMany({}),
    CommercialContract.deleteMany({}),
    SubContract.deleteMany({}),
  ]);

  await Promise.all([
    Message.insertMany(sampleMessages),
    ResidentialContract.create(sampleResidential),
    CommercialContract.create(sampleCommercial),
    SubContract.create(sampleSub),
  ]);

  logger.info('Seed complete', {
    messages: sampleMessages.length,
    residential: 1,
    commercial: 1,
    sublease: 1,
  });
  logger.info('Create a login with: npm run create-admin -- --email <email> --password <password>');

  await disconnectDatabase();
}

main().catch(async (err) => {
  logger.error('Seed failed', { message: err.message });
  await disconnectDatabase().catch(() => {});
  process.exit(1);
});
