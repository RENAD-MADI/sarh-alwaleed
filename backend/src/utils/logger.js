import env from '../config/env.js';

/**
 * Minimal structured logger. Deliberately never logs request bodies: every
 * contract payload in this system contains national IDs and IBANs.
 */
function emit(level, message, meta) {
  if (env.isTest && level !== 'error') return;

  const entry = { level, time: new Date().toISOString(), message };
  if (meta && Object.keys(meta).length > 0) entry.meta = meta;

  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else console.log(line);
}

export const logger = {
  info: (message, meta) => emit('info', message, meta),
  warn: (message, meta) => emit('warn', message, meta),
  error: (message, meta) => emit('error', message, meta),
};

export default logger;
