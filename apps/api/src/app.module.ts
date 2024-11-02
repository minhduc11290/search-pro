import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import mikroConfig from 'config/mikro-orm.config';

@Module({
  imports: [MikroOrmModule.forRoot(mikroConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
