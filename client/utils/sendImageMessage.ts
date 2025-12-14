import { SocketController } from "@/socket/socketController";
import { t } from "i18next";
import { router } from "expo-router";
import * as FileSystem from "expo-file-system/legacy";
import { nanoid } from "nanoid/non-secure";
import { Alert } from "react-native";
import { Chat, User } from "@/types";

export default async function SendImageMessage(user: User, chat: Chat, imageUri: string) {
    try {
        if (!user?.id || !chat?.id || !imageUri.length) return;

        const base64 = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        if (!base64) {
            Alert.alert(t("camera.noImage"));
            return;
        }

        const chatDir = `${FileSystem.documentDirectory}chats/${chat.id}`;
        await FileSystem.makeDirectoryAsync(chatDir, { intermediates: true });

        const fileName = `msg_${Date.now()}_${nanoid(6)}.jpg`;
        const filePath = `${chatDir}/${fileName}`;

        await FileSystem.writeAsStringAsync(filePath, base64, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const socket = SocketController.getInstance({
            url: process.env.EXPO_PUBLIC_API_URL,
            token: user.id,
        });

        await socket.sendMessage({
            chat,
            messageContent: "",
            ImageBase64: base64,
            localImageUri: filePath,
        });

        router.replace({
            pathname: "/chat/chat",
            params: { id: chat.id },
        });
    } catch (err) {
        console.error(t("camera.error"), err);
        Alert.alert("Error", t("camera.error"));
    }
}