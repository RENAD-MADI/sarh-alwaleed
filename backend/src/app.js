import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'node:path';

import env from './config/env.js';
import routes from './routes/index.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // Rate limiters and secure cookies need the real client IP behind a proxy.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          // The static pages carry inline handlers and <style> blocks; the CDN
          // entries cover Bootstrap/Animate/WOW/axios which they load directly.
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://cdn.jsdelivr.net',
            'https://cdnjs.cloudflare.com',
            'https://unpkg.com',
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://cdnjs.cloudflare.com',
            // The site's Arabic typeface (Cairo) is imported from Google Fonts.
            'https://fonts.googleapis.com',
          ],
          imgSrc: ["'self'", 'data:', 'blob:'],
          mediaSrc: ["'self'"],
          fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
          formAction: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      // Attachments are same-origin only; this stops other sites embedding them.
      crossOriginResourcePolicy: { policy: 'same-origin' },
    })
  );

  app.use(
    cors({
      // No configured origins => same-origin only, which is the intended setup.
      origin: env.corsOrigins.length > 0 ? env.corsOrigins : false,
      credentials: true,
    })
  );

  app.use(compression());
  app.use(cookieParser());
  // Contract payloads are large but bounded; the cap blocks memory-exhaustion.
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  if (!env.isTest) {
    // `tiny` records method, path, status and time — never request bodies.
    app.use(morgan('tiny'));
  }

  app.use(globalLimiter);
  app.use('/', routes);

  if (env.serveFrontend) {
    app.use(
      express.static(env.frontendDir, {
        index: 'index.html',
        extensions: ['html'],
      })
    );

    // Anything unmatched that is not an API path gets the branded 404 page.
    app.use((req, res, next) => {
      if (req.method !== 'GET' || req.accepts('html') !== 'html') return next();
      res.status(404).sendFile(path.join(env.frontendDir, '404.html'), (err) => {
        if (err) next();
      });
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp;
