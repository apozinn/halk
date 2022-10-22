import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserController } from './controllers/user/user.controller';
import { ChatController } from './controllers/chat/chat.controller';
import { RegisterController } from './controllers/register/register.controller';
import { ChatGateway } from './gateways/chat/chat.gateway';

@Module({
  imports: [],
  controllers: [UserController, ChatController, RegisterController],
  providers: [AppService, ChatGateway],
})

export class AppModule {}