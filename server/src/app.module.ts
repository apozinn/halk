import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { ChatGateway } from './gateways/chat/chat.gateway';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [],
  controllers: [UserController, AppController, AuthController],
  providers: [AppService, ChatGateway],
})

export class AppModule {}