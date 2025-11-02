import { useContext, useEffect } from "react";
import { SocketController } from "./socketController";
import { UserContext } from "@/contexts/user";
import { ChatsContext } from "@/contexts/chats";
import { Chat, Message } from "@/types";
import { saveChatImage } from "@/utils/saveChatImage";

export default function SocketListener() {
  const { user, updateUser } = useContext(UserContext);
  const { chats, updateChats } = useContext(ChatsContext);

  useEffect(() => {
    if (!user?.id) return;

    const socketController = SocketController.getInstance({
      url: process.env.EXPO_PUBLIC_API_URL,
      token: user.id,
    });

    socketController.injectAccessors({
      getUser: () => user,
      updateUser,
      getChats: () => chats,
      updateChats,
    });

    if (!socketController.isConnected()) socketController.connect();

    socketController.on("receiveMessage", async (message: Message) => {
      const chatIndex = chats.findIndex((c) => c.id === message.chatId);
      if (chatIndex === -1) return;

      const chat = chats[chatIndex];
      if (chat.messages.some((m) => m.id === message.id)) return;

      const updatedChats = [...chats];
      const newMessage = { ...message };

      if (newMessage.image) {
        const filePath = await saveChatImage(chat.id, newMessage.image);
        if (filePath) newMessage.image = filePath;
      }

      updatedChats[chatIndex] = {
        ...chat,
        messages: [...chat.messages, newMessage],
      };

      updateChats(updatedChats);
    });

    socketController.on("newChat", ({ newChat }: { newChat: Chat }) => {
      const existingChatIndex = chats.findIndex((c) => c.id === newChat.id);
      const updatedChats = [...chats];

      if (existingChatIndex !== -1) {
        const existing = updatedChats[existingChatIndex];
        updatedChats[existingChatIndex] = {
          ...existing,
          messages: [...existing.messages, ...newChat.messages],
        };
      } else {
        updatedChats.push(newChat);
      }

      updateChats(updatedChats);
    });

    socketController.on("readMessage", ({ chat: chatId }: { chat: string }) => {
      const updatedChats = chats.map((c) =>
        c.id === chatId
          ? { ...c, messages: c.messages.map((m) => ({ ...m, read: true })) }
          : c
      );

      updateChats(updatedChats);
    });

    return () => socketController.disconnect();
  }, [user?.id, chats]);

  return null;
}
