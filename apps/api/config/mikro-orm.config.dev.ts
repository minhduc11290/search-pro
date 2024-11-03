import { defineConfig } from '@mikro-orm/postgresql';
import conf from './mikro-orm.config';
import * as entities from '../src/entities';
import { SeedManager } from '@mikro-orm/seeder';

export default defineConfig({
  ...conf,
  entities: Object.values(entities),
  extensions: [SeedManager],
  migrations: {
    snapshot: true,
  },
  seeder: {
    path: './seeders',
    defaultSeeder: 'MultipleSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    fileName: (className: string) => className,
  },
});
