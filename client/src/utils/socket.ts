import io from "socket.io-client";
import * as uuid from "uuid";
import { Cipher, Decipher } from "../../middleware/crypto";

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
      const chat = this.chats.filter((c) => c.id === payload.chat.id)[0];
      if (chat) {
        chat.messages
          .filter((m) => m.read === false)
          .map((m) => (m.read = true));
        this.updateChats({ chats: this.chats });
      }
    });
  }

  static joinedChat({chats, chat, socket}) {
    socket.emit("joinRoom", { room: chat.id, otherUser: chat.user.id });
    socket.emit("verifyIfUserIsOnline", { userId: chat.user.id });
    socket.on("readMessage", (p) => {
      chats
        .filter((c) => c.id === chat.id)
        .map((c) => {
          c.messages.map((m) => m.read === true);
        });
      updateChats({ chats });
    });
  }

  static sendMessage({ user, chats, updateChats, chat, socket, text }) {
    const timeNow = new Date().getTime();
    const message = {
      chat: {
        id: chat.id,
        key: chat.key,
      },
      author: user,
      read: false,
      createdAt: timeNow,
      content: Cipher(text, chat.key),
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
        key: chat.key,
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

    chats.filter((c) => c.id === chat.id).map((c) => c.messages.push(message));
    updateChats({ chats });
  }

  static sendHalkMessage() {
    const timeNow = new Date().getTime();
    const halkUser = {
      id: "0",
      phone: "+00",
      profile: {
        name: "Halk",
        username: "Halk",
        avatar: require("../../assets/images/icon.png"),
        bio: "Official account of the team Halk",
      },
    };

    const halkChat = {
      id: "a384b2bc-1a3b-49d3-bdf5-1be72350c494",
      user: halkUser,
      key: "0000",
      messages: [
        {
          author: halkUser,
          content: "Welcome to halk!",
          createdAt: timeNow,
          id: `${timeNow}${Math.floor(
            Math.random() * (100000000 - 1000000 + 1) + 1000000
          )}`,
          read: false,
        },
      ],
    };

    return halkChat;
  }
}

export function CreateSocketConnection({ userId }) {
  const socket = io("http://localhost:3000", {
    transports: ["websocket"],
    auth: {
      userId,
    },
  });

  return socket;
}
