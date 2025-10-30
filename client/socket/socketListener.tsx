import { useContext, useEffect } from "react";
import { SocketController } from "./socketController";
import { UserContext } from "@/contexts/user";
import { ChatsContext } from "@/contexts/chats";
import { Chat, Message } from "@/types";

export default function SocketListener() {
    const { user, updateUser } = useContext(UserContext);
    const { chats, updateChats } = useContext(ChatsContext);

    useEffect(() => {
        if(!user.id) return;
        const socketController = SocketController.getInstance({
            url: process.env.EXPO_PUBLIC_API_URL,
            token: user.id
        });

        socketController.injectAccessors({
            getUser: () => user,
            updateUser,
            getChats: () => chats,
            updateChats,
        });
    }, [user, chats]);

    useEffect(() => {
        if(!user.id) return;

        const socketController = SocketController.getInstance({
            url: process.env.EXPO_PUBLIC_API_URL,
            token: user.id
        });

        if (!socketController.isConnected()) {
            socketController.connect();
        }

        socketController.on("receiveMessage", (message: Message) => {
            const chat = chats.filter((c) => c.id === message.chatId)[0];
            if (chat) {
                if (chat.messages.some((m) => m.id === message.id)) return;
                chats
                    .filter((c) => c.id === message.chatId)
                    .map((c) => c.messages.push(message));
                updateChats(chats);
            }
        })

        socketController.on("newChat", ({ newChat }: { newChat: Chat }) => {
            const existingChats = chats.find((c) => c.id === newChat.id)

            if (existingChats) {
                existingChats.messages.push(newChat.messages.at(-1) as Message);
            } else {
                chats.push(newChat);
            }

            updateChats(chats)
        });

        socketController.on("readMessage", (payload: { chat: string }) => {
            chats
                .filter((c) => c.id === payload.chat)
                .forEach((c) =>
                    c.messages.forEach((m) => {
                        m.read = true;
                    })
                );

            updateChats(chats)
        });

        return () => {
            socketController.disconnect();
        };
    }, []);

    return null;
}