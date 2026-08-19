import multer from 'multer';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

const ALLOWED_MIME = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['application/pdf', '.pdf'],
]);

fs.mkdirSync(env.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.uploadDir),
  filename: (_req, file, cb) => {
    // The original name is attacker-controlled and often Arabic. Store a random
    // name with an extension derived from the (validated) MIME type, so the
    // filename can never contain path separators or a second extension.
    const ext = ALLOWED_MIME.get(file.mimetype) ?? '';
    cb(null, `${Date.now()}-${crypto.randomBytes(12).toString('hex')}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  if (!ALLOWED_MIME.has(file.mimetype)) {
    cb(ApiError.badRequest('Only JPEG, PNG or PDF files are allowed'));
    return;
  }
  cb(null, true);
}

/**
 * Builds an upload handler for a fixed set of attachment fields.
 * Fields are whitelisted so an unexpected field name is rejected rather than
 * silently written to disk.
 */
export function uploadFields(fieldNames) {
  const handler = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: env.maxUploadBytes,
      files: fieldNames.length * env.maxFilesPerField,
    },
  }).fields(fieldNames.map((name) => ({ name, maxCount: env.maxFilesPerField })));

  return (req, res, next) =>
    handler(req, res, (err) => {
      if (!err) return next();
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(
            ApiError.tooLarge(
              `File too large. Maximum size is ${Math.round(env.maxUploadBytes / 1024 / 1024)}MB.`
            )
          );
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(ApiError.badRequest(`Unexpected upload field: ${err.field}`));
        }
        return next(ApiError.badRequest(err.message));
      }
      return next(err);
    });
}

/** Removes files already written to disk when the surrounding request fails. */
export async function discardUploads(files) {
  if (!files) return;
  const all = Object.values(files).flat();
  await Promise.all(
    all.map((file) =>
      fs.promises.unlink(path.join(env.uploadDir, path.basename(file.filename))).catch(() => {})
    )
  );
}

/**
 * Maps multer's per-field file lists onto the `{ secure_url }` shape the
 * dashboards render, using the caller's field -> model-property mapping.
 */
export function collectAttachments(files, fieldMap) {
  const result = {};
  for (const [formField, modelField] of Object.entries(fieldMap)) {
    const uploaded = files?.[formField] ?? [];
    result[modelField] = uploaded.map((file) => ({
      secure_url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    }));
  }
  return result;
}
