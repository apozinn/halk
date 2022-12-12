import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as uuid from 'uuid';
import { PayloadMessage } from '../../../types';
import { AppService } from 'src/app.service';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly appService: AppService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, payload: PayloadMessage) {
    const clients = this.server.sockets.sockets;
    const message = payload.message;
    const to = payload.to;

    clients.forEach((clt, key, map) => {
      const userId = clt.handshake.auth.userId;
      if (userId === to) {
        clt.emit('receiveMessage', message);
      }
    });
  }

  @SubscribeMessage('pullOnlineUser')
  async pullOnlineUsers(client: Socket, payload) {}

  @SubscribeMessage('readMessage') 
  async readMessage(client: Socket, payload) {}

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    this.logger.log(`${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`${client.id} disconnected`);
  }
}
