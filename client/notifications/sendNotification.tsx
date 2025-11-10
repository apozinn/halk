import { Message, User } from "@/types";
import * as Notifications from 'expo-notifications';
import { t } from 'i18next';

export default function SendNotification({ message, author }: { message: Message, author: User }) {
    Notifications.scheduleNotificationAsync({
        content: {
            title: author.profile.username,
            body: message.content ?? `📷 ${t("chat.isImageMessage")}`,
            sound: true,
            data: {
                screen: "/chat/chat",
                chatId: message.chatId
            }
        },
        trigger: null
    });
}
