import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { ChatGateway } from './gateways/chat/chat.gateway';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UploadController } from './upload/upload.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CloudinaryModule],
  controllers: [UserController, AppController, AuthController, UploadController],
  providers: [AppService, ChatGateway],
})

export class AppModule {}