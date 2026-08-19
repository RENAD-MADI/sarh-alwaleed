import env from './config/env.js';
import logger from './utils/logger.js';
import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './db/connect.js';

async function start() {
  await connectDatabase();

  const app = createApp();
  const server = app.listen(env.port, env.host, () => {
    logger.info(`API listening on http://${env.host}:${env.port}`, { env: env.nodeEnv });
  });

  // Finish in-flight requests before exiting so a deploy cannot truncate an
  // upload halfway through writing a contract.
  const shutdown = async (signal) => {
    logger.info(`Received ${signal}, shutting down`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason: String(reason) });
  process.exit(1);
});

start().catch((err) => {
  logger.error('Failed to start server', { message: err.message, stack: err.stack });
  process.exit(1);
});
