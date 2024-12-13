import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { CustomGuard } from '~/decorators/custom-guard.decorator';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [JwtService, CustomGuard],
  controllers: [FileController],
})
export class FileModule { }
