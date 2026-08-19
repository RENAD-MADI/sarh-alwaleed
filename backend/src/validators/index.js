import { z } from 'zod';

const saudiPhone = z
  .string()
  .trim()
  .regex(/^05\d{8}$/, 'Phone must start with 05 and be 10 digits');

const saudiId = z
  .string()
  .trim()
  .regex(/^[12]\d{9}$/, 'ID must be 10 digits starting with 1 or 2');

const optionalEmail = z
  .string()
  .trim()
  .max(160)
  .refine((v) => v === '' || z.string().email().safeParse(v).success, 'Invalid email address')
  .optional()
  .default('');

export const messageSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(120),
  phone: saudiPhone,
  // The public form posts this field capitalised; accept either spelling.
  email: optionalEmail,
  Email: optionalEmail,
  subject: z.string().trim().min(2, 'Subject is too short').max(200),
  message: z.string().trim().min(2, 'Message is too short').max(5000),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required').max(200),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  // The dashboards show one contract per screen; keep that the default.
  limit: z.coerce.number().int().min(1).max(100).default(1),
});

export const statusUpdateSchema = z.object({
  status: z.enum(['pending', 'in_review', 'issued', 'rejected']),
});

/**
 * Contract payloads carry ~150 optional fields that the multi-step forms build
 * up. Rather than restate every one, validate the identity fields that must be
 * correct and let the Mongoose schema drop anything it does not declare.
 */
export const residentialContractSchema = z.object({
  ownerName: z.string().trim().min(2, 'Owner name is required').max(200),
  ownerID: saudiId,
  ownerPhone: saudiPhone,
  clientName: z.string().trim().min(2, 'Tenant name is required').max(200),
  clientIDNumber: saudiId,
  clientPhone: saudiPhone,
}).passthrough();

export const commercialContractSchema = z.object({
  ownerID: saudiId,
  ownerPhone: saudiPhone,
  commercialClientID: saudiId,
  commercialClientPhone: saudiPhone,
}).passthrough();

export const subContractSchema = z.object({
  ownerName: z.string().trim().min(2, 'Owner name is required').max(200),
  ownerID: z.string().trim().min(5, 'Owner ID is required').max(30),
  ownerPhone: saudiPhone,
  clientName: z.string().trim().min(2, 'Tenant name is required').max(200),
  clientID: z.string().trim().min(5, 'Tenant ID is required').max(30),
  clientPhone: saudiPhone,
}).passthrough();
