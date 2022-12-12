import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ConnectDb from '../middleware/database/index';

async function bootstrap() {
  await ConnectDb();
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();
  await app.listen(3000);
}

bootstrap();