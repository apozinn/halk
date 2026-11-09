import { SocketController } from "@/socket/socketController";
import { t } from "i18next";
import { router } from "expo-router";
import * as FileSystem from "expo-file-system/legacy";
import { nanoid } from "nanoid/non-secure";
import { Alert } from "react-native";
import { Chat, User } from "@/types";

type MediaType = "image" | "video" | "livePhoto" | "pairedVideo" | undefined | null;

export default async function SendMediaMessage(
    user: User,
    chat: Chat,
    mediaUri: string,
    mediaType: MediaType
) {
    try {
        if (!user?.id || !chat?.id || !mediaUri.length) return;

        const base64 = await FileSystem.readAsStringAsync(mediaUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        if (!base64) {
            Alert.alert(
                mediaType === "image"
                    ? t("camera.noImage")
                    : t("camera.noVideo")
            );
            return;
        }

        const chatDir = `${FileSystem.documentDirectory}chats/${chat.id}`;
        await FileSystem.makeDirectoryAsync(chatDir, { intermediates: true });

        const extension = mediaType === "image" ? "jpg" : "mp4";
        const fileName = `msg_${Date.now()}_${nanoid(6)}.${extension}`;
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
            ImageBase64: mediaType === "image" ? base64 : undefined,
            VideoBase64: mediaType === "video" ? base64 : undefined,
            localImageUri: mediaType === "image" ? filePath : undefined,
            localVideoUri: mediaType === "video" ? filePath : undefined,
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
