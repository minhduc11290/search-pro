import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MikroORM } from '@mikro-orm/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Search Pro API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
  await app.get(MikroORM).getSchemaGenerator().updateSchema();
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
