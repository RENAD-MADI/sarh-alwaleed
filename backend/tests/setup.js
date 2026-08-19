/**
 * Test environment. Imported before anything that reads config, because ES
 * module imports are evaluated in order and `src/config/env.js` snapshots
 * `process.env` the moment it is first loaded.
 */
import os from 'node:os';
import path from 'node:path';

process.env.NODE_ENV = 'test';
// Fixed only so tests are deterministic; never used outside the test run.
process.env.JWT_SECRET = 'test-only-value-not-a-real-secret';
process.env.SERVE_FRONTEND = 'false';
// Keep test attachments out of the real uploads directory.
process.env.UPLOAD_DIR = path.join(os.tmpdir(), 'sarh-test-uploads');
