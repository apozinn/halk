import * as FileSystem from "expo-file-system/legacy";
import { t } from "i18next";
import { nanoid } from "nanoid/non-secure";

export async function saveChatVideo(chatId: string, base64Data: string): Promise<string | null> {
  try {
    const chatDir = `${FileSystem.documentDirectory}chats/${chatId}`;
    await FileSystem.makeDirectoryAsync(chatDir, { intermediates: true });

    const fileName = `msg_${Date.now()}_${nanoid(6)}.mp4`;
    const filePath = `${chatDir}/${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return filePath;
  } catch (err) {
    console.error(t("camera.error"), err);
    return null;
  }
}
