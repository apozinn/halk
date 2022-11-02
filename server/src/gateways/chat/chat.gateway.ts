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

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
  private connectedUsers: { socketId: string; userId: string }[] = [];
  private activeRooms: { room: string; id: string }[] = [];
  private bufferMessages = [];

  private async sendEvent(event, user) {}

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, payload: any) {
    client.join(payload.room);

    const otherUser = this.connectedUsers?.filter(
      (u) => u.userId === payload.otherUser,
    )[0];
    if (otherUser)
      this.server
        .to(otherUser.socketId)
        .emit('readMessage', { chat: payload.room, readUser: payload.userId });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: any): void {
    const userId = payload.toUser;
    const userReceive = this.connectedUsers?.filter(
      (u) => u.userId === userId,
    )[0];

    if (userReceive) {
      this.server
        .to(userReceive.socketId)
        .emit('receiveMessage', payload.message);
    } else {
      this.server.to(payload.room).emit('receiveMessage', payload.message);
    }

    if (this.connectedUsers?.some((u) => u.userId === userId)) {
      this.bufferMessages?.push(payload);
    }

    if (payload.newChat) {
      const newChat = {
        id: payload.room,
        user: payload.message.author,
        messages: [],
        key: payload.key,
      };

      newChat.messages.push(payload.message);

      if (this.connectedUsers?.some((u) => u.userId === userId)) {
        this.server.to(userReceive.socketId).emit('newChat', { newChat });
      } else {
        this.bufferMessages?.push(newChat);
      }
    }
  }

  @SubscribeMessage('newChat')
  newChat(client: Socket, payload: any) {
    const chat = payload.chat;
    this.server.emit('roomCreated', chat);
  }

  @SubscribeMessage('verifyIfUserIsOnline')
  getOnlineUsers(client: Socket, payload: any) {
    const isOnline = this.connectedUsers?.filter(
      (u) => u.userId === payload.userId,
    )[0]
      ? true
      : false;

    client.emit('receiveIfUserIsOnline', isOnline);
  }

  @SubscribeMessage('userTyping')
  userTyping(client: Socket, payload: any) {
    this.server.to(payload.room).emit('userTyping', payload);
  }

  @SubscribeMessage('readMessage')
  readMessage(client: Socket, payload: any) {
    if (!payload.otherUser) return;
    this.server
      .to(payload.otherUser)
      .emit('readMessage', { chat: payload.chat, user: payload.otherUser });
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    const { id } = client;

    const exitisUserConnection = this.connectedUsers?.filter(
      (u) => u.userId === userId,
    )[0];

    if (exitisUserConnection) {
      exitisUserConnection.socketId = id;
    } else {
      this.connectedUsers?.push({
        socketId: id,
        userId: userId,
      });
    }

    if (this.bufferMessages?.some((m) => m.toUser === userId)) {
      this.bufferMessages
        ?.filter((m) => m.toUser === userId)
        .map((m) => {
          if (m.key) {
            this.server.to(id).emit('newChat', { newChat: m });
          } else {
            this.server.to(id).emit('receiveMessage', m);
          }
        });
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers = this.connectedUsers?.filter(
      (u) => u.socketId !== client.id,
    );
  }
}
