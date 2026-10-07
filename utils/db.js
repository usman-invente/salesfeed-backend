import mongoose from 'mongoose';
import pino from 'pino';

// Initialize logger (Development mein readable visual output, Production mein structured JSON)
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV !== 'production' && {
    transport: { target: 'pino-pretty' },
  }),
});

mongoose.set('strictQuery', true);

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    logger.debug('Using existing database connection');
    return;
  }

  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    logger.fatal('FATAL ERROR: MONGO_URI environment variable is not defined.');
    process.exit(1);
  }

  const options = {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  try {
    const conn = await mongoose.connect(mongoURI, options);
    logger.info(
      { host: conn.connection.host, port: conn.connection.port, db: conn.connection.name },
      'MongoDB Connected'
    );
  } catch (error) {
    logger.error({ err: error.message }, 'MongoDB connection failed');
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  logger.error({ err }, 'MongoDB connection error');
});

const gracefulShutdown = async (signal) => {
  logger.info({ signal }, 'Closing MongoDB connection...');
  try {
    await mongoose.connection.close(false);
    logger.info('MongoDB connection closed cleanly through app termination.');
    process.exit(0);
  } catch (err) {
    logger.error({ err: err.message }, 'Error during MongoDB connection teardown');
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

export default connectDB;