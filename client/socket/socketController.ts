import { io, Socket } from "socket.io-client";
import { nanoid } from "nanoid/non-secure";
import { User, Chat, Message } from "@/types";
import { t } from "i18next";
import * as FileSystem from "expo-file-system/legacy";

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
  updateUser: (newData: { user?: Partial<User>, logged?: boolean}) => Promise<void>
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
    }

    this.emit("verifyIfUserIsOnline", { userId: chat.user.id });
  }

  public async sendMessage({
    chat,
    messageContent,
    ImageBase64 = undefined,
    VideoBase64 = undefined,
    localImageUri = undefined,
    localVideoUri = undefined,
  }: {
    chat: Chat;
    messageContent: string;
    ImageBase64?: string;
    VideoBase64?: string;
    localImageUri?: string;
    localVideoUri?: string;
  }): Promise<void> {
    if (!this.accessors || !this.socket) return;

    const user = this.accessors.getUser();
    let chats = this.accessors.getChats() ?? [];
    if (!user) return;
    if (!messageContent?.trim() && !localImageUri && !localVideoUri) return;

    const isLocalImage = localImageUri?.startsWith("file://");
    const isLocalVideo = localVideoUri?.startsWith("file://");

    const localImageName = isLocalImage ? localImageUri!.split("/").pop()! : undefined;
    const localVideoName = isLocalVideo ? localVideoUri!.split("/").pop()! : undefined;

    const message: Message = {
      chatId: chat.id,
      authorId: user.id,
      createdAt: Date.now(),
      read: false,
      content: messageContent,
      id: nanoid(),
      image: ImageBase64,
      video: VideoBase64,
    };

    this.emit("sendMessage", {
      room: chat.id,
      toUser: chat.user.id,
      message,
      newChat: chat.newChat,
    });

    if (localImageUri) message.image = localImageUri;
    if (localVideoUri) message.video = localVideoUri;

    const chatIndex = chats.findIndex((c) => c.id === chat.id || c.user.id === chat.user.id);
    if (chatIndex !== -1) {
      chats[chatIndex] = {
        ...chats[chatIndex],
        newChat: false,
        messages: [...chats[chatIndex].messages, message],
      };
    } else {
      chats = [...chats, { ...chat, newChat: false, messages: [message] }];
    }

    const dir = FileSystem.documentDirectory + "chats/" + chat.id + "/";
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

    if (isLocalImage && localImageUri) {
      const newPath = dir + localImageName!;
      if (localImageUri !== newPath) {
        await FileSystem.copyAsync({ from: localImageUri, to: newPath });
      }
    }

    if (isLocalVideo && localVideoUri) {
      const newPath = dir + localVideoName!;
      if (localVideoUri !== newPath) {
        await FileSystem.copyAsync({ from: localVideoUri, to: newPath });
      }
    }

    await this.accessors.updateChats(chats);
  }
}
