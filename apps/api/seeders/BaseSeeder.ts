import { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

export class BaseSeeder extends Seeder {
  async run(em: EntityManager, context?: Dictionary): Promise<void> {
    await this.run(em, context);
  }
}
