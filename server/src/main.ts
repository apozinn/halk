import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ConnectDb from '../middleware/database/index';

async function bootstrap() {
  await ConnectDb();

  const port = process.env.PORT;
  console.log(`running in port: ${port}`);

  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();
  await app.listen(port);
}

bootstrap();