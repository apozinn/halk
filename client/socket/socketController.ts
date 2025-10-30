import { io, Socket } from "socket.io-client";
import { nanoid } from "nanoid";
import { User, Chat, Message } from "@/types";
import { t } from "i18next";

type SocketEventPayloads = {
  joinRoom: { room: string; otherUser: string };
  verifyIfUserIsOnline: { userId: string };
  readMessage: { chat: string; otherUser: string };
  sendMessage: { room: string; toUser: string; message: Message; newChat: boolean };
  receiveMessage: { message: Message };
  newChat: { chat: Chat };
  userTyping: { room: string; typing: boolean; userId: string };
  connect: () => void;
  disconnect: (reason: Socket.DisconnectReason) => void;
  newMessage: (data: { message: Message; chatId: string }) => void;
};

interface SocketOptions {
  url: string;
  token: string;
}

interface StateAccessors {
  getUser: () => User;
  updateUser: (u: User) => void;
  getChats: () => Chat[];
  updateChats: (chats: Chat[]) => void;
}

export class SocketController {
  private static instance: SocketController;
  private socket: Socket | null = null;
  private url: string;
  private token?: string;
  private accessors: StateAccessors | null = null;

  private constructor({ url, token }: SocketOptions) {
    this.url = url;
    this.token = token;
  }

  public static getInstance(options: SocketOptions): SocketController {
    if (!SocketController.instance) {
      SocketController.instance = new SocketController(options);
    }
    return SocketController.instance;
  }

  public injectAccessors(accessors: StateAccessors): void {
    if (!accessors.getUser || !accessors.getChats || !accessors.updateChats) {
      throw new Error(t("socket.error.invalidAccessors"));
    }
    this.accessors = accessors;
  }

  public connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(this.url, {
      transports: ["websocket"],
      auth: { token: this.token },
    });

    this.on("connect", () => console.log(t("socket.log.connected")));
    this.on("disconnect", (reason: string) => console.warn(t("socket.log.disconnected", { reason })));
  }

  public setToken(token: string): void {
    this.token = token;
    if (this.socket) {
      this.socket.auth = { token };
      this.reconnect();
    }
  }

  public reconnect(): void {
    this.socket?.disconnect();
    this.connect();
  }

  public on<E extends keyof SocketEventPayloads>(event: E, callback: any): void {
    this.socket?.on(event, callback);
  }

  public off(event: keyof SocketEventPayloads, callback?: (...args: any[]) => void): void {
    this.socket?.off(event, callback);
  }

  public emit<E extends keyof Pick<SocketEventPayloads, "joinRoom" | "verifyIfUserIsOnline" | "readMessage" | "sendMessage" | "userTyping">>(
    event: E,
    data: SocketEventPayloads[E]
  ): void {
    if (!this.socket) {
      console.error(t("socket.error.noConnection"));
      return;
    }
    this.socket.emit(event, data);
  }

  public disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  public joinedChat(chat: Chat): void {
    if (!this.accessors || !this.socket) {
      console.error(t("socket.error.noAccessorsOrSocket"));
      return;
    }

    const user = this.accessors.getUser();
    if (!user) {
      console.error(t("socket.error.noUser"));
      return;
    }

    if (chat.id) {
      this.emit("joinRoom", { room: chat.id, otherUser: chat.user.id });
      this.emit("readMessage", { chat: chat.id, otherUser: chat.user.id });
    } else {
      console.warn(t("socket.warn.chatWithoutId"));
    }

    this.emit("verifyIfUserIsOnline", { userId: chat.user.id });
  }

  public sendMessage(chat: Chat, text: string): void {
    if (!this.accessors || !this.socket) {
      console.error(t("socket.error.noAccessorsOrSocket"));
      return;
    }

    const user = this.accessors.getUser();
    let chats = this.accessors.getChats() ?? [];

    if (!user) {
      console.error(t("socket.error.noUser"));
      return;
    }

    if (!text.trim()) {
      console.warn(t("socket.warn.emptyMessage"));
      return;
    }

    const message: Message = {
      chatId: chat.id,
      authorId: user.id,
      createdAt: Date.now(),
      read: false,
      content: text,
      id: nanoid(),
    };

    this.emit("sendMessage", {
      room: chat.id,
      toUser: chat.user.id,
      message,
      newChat: chat.newChat,
    });

    const chatIndex = chats.findIndex((c) => c.id === chat.id || c.user.id === chat.user.id);

    if (chatIndex !== -1) {
      chats[chatIndex] = {
        ...chats[chatIndex],
        newChat: false,
        messages: [...chats[chatIndex].messages, message],
      };
    } else {
      const newChat: Chat = { ...chat, newChat: false, messages: [message] };
      chats = [...chats, newChat];
    }

    this.accessors.updateChats(chats);
  }
}
