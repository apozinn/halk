import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserController } from './controllers/user/user.controller';
import { ChatGateway } from './gateways/chat/chat.gateway';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [UserController, AppController],
  providers: [AppService, ChatGateway],
})

export class AppModule {}