// import { defineConfig } from '@mikro-orm/postgresql';
// import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

// export default defineConfig({
//   dbName: 'search_pro',
//   entities: ['dist/**/*.entity.js'],
//   entitiesTs: ['src/**/*.entity.ts'],
//   metadataProvider: TsMorphMetadataProvider,
//   debug: true,
// });

// import { defineConfig, ReflectMetadataProvider } from '@mikro-orm/core';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import dotenv from 'dotenv';

// dotenv.config();

export default defineConfig({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  discovery: { disableDynamicFileAccess: true },
  dbName: process.env.DATABASE_NAME || 'search_pro',
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  driverOptions: {
    connection: { ssl: process.env.DATABASE_SSL === 'true' },
  },
});
