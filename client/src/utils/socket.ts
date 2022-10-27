import io from "socket.io-client";
import * as uuid from "uuid";
import { Cipher, Decipher } from "../../middleware/crypto";

export const readMessages = ({ chats, updateChats, chat }) => {
  chats
    .filter((c) => c.id === chat.id)
    .map((c) => c.messages)
    .map((m) => console.log(m));
  updateChats({ chats });
};

export class SocketController {
  constructor(props) {
    this.user = props.user;
    this.updateUser = props.updateUser;
    this.chats = props.chats;
    this.updateChats = props.updateChats;
    this.socket = props.socket;

    this.loadEvents();
  }

  public loadEvents() {
    this.socket.on("receiveMessage", (msg) => {
      const chat = this.chats.filter((c) => c.id === msg.chat.id)[0];
      if (chat) {
        if (chat.messages.some((m) => m.id === msg.id)) return;
        this.chats
          .filter((c) => c.id === msg.chat.id)
          .map((c) => c.messages.push(msg));
        this.updateChats({ chats: this.chats });
      }
    });

    this.socket.on("newChat", ({ newChat }) => {
      this.chats.push(newChat);
      this.updateChats({ chats: this.chats });
    });

    this.socket.on("readMessage", (payload) => {
      this.chats
        .filter((c) => c.id === payload.chat)
        .map((c) => {
          c.messages.filter((m) => !m.read).map((m) => (m.read = true));
        });
      this.updateChats({ chats: this.chats });
    });
  }

  static joinedChat({ chats, updateChats, chat, socket }) {
    socket.emit("joinRoom", { room: chat.id, otherUser: chat.user.id });
    socket.emit("verifyIfUserIsOnline", { userId: chat.user.id });
    socket.emit("readMessage", { chat: chat.id, otherUser: chat.user.id });
  }

  static sendMessage({ user, chats, updateChats, chat, socket, text }) {
    const timeNow = new Date().getTime();
    const message = {
      chat: {
        id: chat.id,
      },
      author: user,
      createdAt: timeNow,
      read: false,
      content: Cipher(text, chat.id),
      id: `${timeNow}${Math.floor(
        Math.random() * (100000000 - 1000000 + 1) + 1000000
      )}`,
    };

    if (chat.newChat) {
      socket.emit("sendMessage", {
        room: chat.id,
        toUser: chat.user.id,
        message,
        newChat: true,
      });
      const thisChat = chats.filter((c) => c.id === chat.id)[0];
      delete thisChat.newChat;
      updateChats({ chats });
    } else {
      socket.emit("sendMessage", {
        room: chat.id,
        toUser: chat.user.id,
        message,
      });
    }

    chats
      .filter((c) => c.id === chat.id)
      .map((c) => {
        c.messages.push(message);
        c.messages
          .filter((m) => m.author.id === chat.user.id)
          .map((m) => (m.read = true));
      });
    updateChats({ chats });
  }

  static getHalkChat() {
    const timeNow = new Date().getTime();
    const chatId = uuid.v4();

    const user = {
      id: uuid.v4(),
      phone: "",
      profile: {
        name: "Halk",
        username: "Halk team",
        avatar: "https://i.imgur.com/Xc979YU.png",
        bio: "Official account of the team Halk",
      },
    };

    const chat = {
      id: chatId,
      user,
      messages: [
        {
          author: user,
          content: Cipher("Welcome to Halk!", chatId),
          createdAt: timeNow,
          id: `${timeNow}${Math.floor(
            Math.random() * (100000000 - 1000000 + 1) + 1000000
          )}`,
          read: false,
        },
      ],
    };

    return chat;
  }
}

export function CreateSocketConnection({ userId }) {
  if (!userId) return;
  const socket = io("http://localhost:3000/", {
    transports: ["websocket"],
    auth: {
      userId,
    },
  });

  return socket;
}
