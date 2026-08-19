import { Router } from 'express';
import express from 'express';
import env from '../config/env.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * Uploaded attachments are ID scans, deeds and family cards. They are served
 * only to signed-in staff — the auth cookie rides along with <img> requests
 * because the dashboards are on the same origin.
 */
router.use(
  '/',
  requireAuth,
  express.static(env.uploadDir, {
    index: false,
    dotfiles: 'deny',
    // Force download semantics so a crafted file can never execute inline.
    setHeaders: (res) => {
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'private, no-store');
    },
  })
);

export default router;
