import mongoose from 'mongoose';
import env from '../config/env.js';
import logger from '../utils/logger.js';

export async function connectDatabase(uri = env.mongoUri) {
  // Fail fast rather than buffering queries against a database that is down.
  mongoose.set('bufferCommands', false);
  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10_000,
    maxPoolSize: 10,
  });

  logger.info('Connected to MongoDB');

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error', { message: err.message });
  });
  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  return mongoose.connection;
}

export async function disconnectDatabase() {
  await mongoose.connection.close();
}

export default connectDatabase;
