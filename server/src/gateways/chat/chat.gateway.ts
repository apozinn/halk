import { Logger } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

interface MessagePayload {
  room: string;
  toUser: string;
  message: any;
  newChat?: boolean;
  key?: string;
}

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger("ChatGateway");

  private connectedUsers = new Map<string, string>(); // userId -> socketId
  private bufferMessages: MessagePayload[] = [];

  afterInit() {
    this.logger.log("✅ WebSocket Gateway initialized");
  }

  private getUserSocket(userId: string): string | undefined {
    return this.connectedUsers.get(userId);
  }

  private emitToUser(userId: string, event: string, data: any) {
    const socketId = this.getUserSocket(userId);
    if (socketId) this.server.to(socketId).emit(event, data);
  }

  @SubscribeMessage("joinRoom")
  joinRoom(client: Socket, payload: { room: string; userId: string; otherUser: string }) {
    client.join(payload.room);
    const otherSocket = this.getUserSocket(payload.otherUser);
    if (otherSocket) {
      this.server.to(otherSocket).emit("readMessage", {
        chat: payload.room,
        readUser: payload.userId,
      });
    }
  }

  @SubscribeMessage("sendMessage")
  handleMessage(client: Socket, payload: MessagePayload): void {
    const { toUser, room, message, newChat, key } = payload;
    const receiverSocket = this.getUserSocket(toUser);

    if (receiverSocket) {
      this.server.to(receiverSocket).emit("receiveMessage", message);
    } else {
      this.server.to(room).emit("receiveMessage", message);
      this.bufferMessages.push(payload);
    }

    if (newChat) {
      const newChatObj = {
        id: room,
        user: message.author,
        messages: [message],
        key,
      };
      if (receiverSocket) {
        this.server.to(receiverSocket).emit("newChat", { newChat: newChatObj });
      } else {
        this.bufferMessages.push({ ...payload, message: newChatObj });
      }
    }
  }

  @SubscribeMessage("newChat")
  newChat(client: Socket, payload: { chat: any }) {
    this.server.emit("roomCreated", payload.chat);
  }

  @SubscribeMessage("verifyIfUserIsOnline")
  verifyIfUserIsOnline(client: Socket, payload: { userId: string }) {
    const isOnline = this.connectedUsers.has(payload.userId);
    client.emit("receiveIfUserIsOnline", isOnline);
  }

  @SubscribeMessage("userTyping")
  userTyping(client: Socket, payload: any) {
    this.server.to(payload.room).emit("userTyping", payload);
  }

  @SubscribeMessage("readMessage")
  readMessage(client: Socket, payload: { chat: string; otherUser: string }) {
    if (!payload.otherUser) return;
    this.emitToUser(payload.otherUser, "readMessage", {
      chat: payload.chat,
      user: payload.otherUser,
    });
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.token;
    if (!userId) {
      client.disconnect();
      return;
    }

    this.connectedUsers.set(userId, client.id);

    const pending = this.bufferMessages.filter((m) => m.toUser === userId);
    if (pending.length > 0) {
      for (const msg of pending) {
        if (msg.newChat) {
          this.server.to(client.id).emit("newChat", { newChat: msg });
        } else {
          this.server.to(client.id).emit("receiveMessage", msg.message);
        }
      }
      this.bufferMessages = this.bufferMessages.filter((m) => m.toUser !== userId);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        break;
      }
    }
  }
}
