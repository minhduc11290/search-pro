import { defineConfig } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import * as entities from '../src/entities';

const logger = new Logger('MikroORM');

export default defineConfig({
  entities: Object.values(entities),
  discovery: { disableDynamicFileAccess: true },
  dbName: process.env.DATABASE_NAME || 'search_pro',
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  driverOptions: {
    connection: { ssl: process.env.DATABASE_SSL === 'true' },
  },
  pool: {
    min: 0,
    max: 100,
    acquireTimeoutMillis: 60000,
    log: (message, logLevel) => console.log(`${logLevel}: ${message}`),
    idleTimeoutMillis: 120000,
  },
  debug: false,
  logger: logger.log.bind(logger),
});
