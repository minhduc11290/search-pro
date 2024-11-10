import type { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { RoleSeeder } from './RoleSeeder';
import { UserSeeder } from './UserSeeder';

const seeds = [RoleSeeder, UserSeeder];

export class MultipleSeeder extends Seeder {
  async run(en: EntityManager): Promise<void> {
    for (const seed of seeds) {
      console.log(`\x1B[34m ${seed.name} running...`);
      const s = new seed();
      await s.run(en);
    }
  }
}
