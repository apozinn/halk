import { Logger } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import User from "middleware/database/schemas/user";
import { Server, Socket } from "socket.io";
import { Chat, Message } from "types";

interface MessagePayload {
  room: string;
  toUser: string;
  message: Message;
  newChat: boolean;
  key: string;
  newChatObj?: any;
  image?: string;
}

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
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
  async handleMessage(client: Socket, payload: MessagePayload): Promise<void> {
    const { toUser, room, message, newChat, key } = payload;
    const receiverSocket = this.getUserSocket(toUser);

    if (newChat) {
      const userProps = await User.findOne({ id: message.authorId });
      if(!userProps) return;

      const newChatObj = {
        id: room,
        user: { id: userProps.id, profile: userProps.profile },
        messages: [message]
      };

      if (receiverSocket) {
        this.server.to(receiverSocket).emit("newChat", { newChat: newChatObj });
      } else {
        payload.newChatObj = newChatObj;
        this.bufferMessages.push({ ...payload });
      }
    } else {
      if (receiverSocket) {
        this.server.to(receiverSocket).emit("receiveMessage", message);
      } else {
        this.bufferMessages.push({ ...payload });
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
      for (const payload of pending) {
        if (payload.newChat) {
          this.server.to(client.id).emit("newChat", { newChat: payload.newChatObj });
        } else {
          this.server.to(client.id).emit("receiveMessage", payload.message);
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
