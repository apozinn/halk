import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserController } from './controllers/user/user.controller';
import { RegisterController } from './controllers/register/register.controller';
import { StatusController } from './controllers/status/status.controller';
import { ChatGateway } from './gateways/chat/chat.gateway';

@Module({
  imports: [],
  controllers: [UserController, RegisterController, StatusController],
  providers: [AppService, ChatGateway],
})

export class AppModule {}