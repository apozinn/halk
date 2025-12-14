import { ThemedView } from "@/components/themed/ThemedView";
import { getColors } from "@/constants/Colors";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Image, Pressable, View, Alert } from "react-native";
import React, { useState, useContext } from "react";
import SelectChatModal from "@/components/chat/selectChatModal";
import { Chat } from "@/types";
import * as FileSystem from "expo-file-system/legacy";
import { SocketController } from "@/socket/socketController";
import { nanoid } from "nanoid/non-secure";
import { UserContext } from "@/contexts/user";
import { t } from "i18next";
import SendImageMessage from "@/utils/sendImageMessage";

export default function Captured() {
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const colors = getColors();
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);

  if (!imageUri) return null;

  const openSelectChat = () => setShowModal(true);

  async function SelectedChat(chat: Chat) {
    if (!user?.id || !imageUri) return;
    
    SendImageMessage(user, chat, imageUri);
  }

  return (
    <View style={styles.container}>
      <SelectChatModal isVisible={showModal} SelectedChat={SelectedChat} />
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      <ThemedView style={styles.overlay}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.7 }]}
        >
          <MaterialIcons name="arrow-back" size={30} color="#fff" />
        </Pressable>
        <Pressable
          onPress={openSelectChat}
          style={({ pressed }) => [
            styles.sendButton,
            { backgroundColor: colors.tint },
            pressed && { opacity: 0.8 },
          ]}
        >
          <AntDesign name="send" size={28} color="#fff" />
        </Pressable>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    transform: [{ scaleX: -1 }],
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: "transparent",
  },
  iconButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 50,
    padding: 10,
    alignSelf: "flex-start",
  },
  sendButton: {
    alignSelf: "center",
    borderRadius: 100,
    padding: 20,
    elevation: 4,
  },
});
