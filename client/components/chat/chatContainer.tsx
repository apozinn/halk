import React, { useState, useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar } from "@kolking/react-native-avatar";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { t } from "i18next";
import { UserContext } from "@/contexts/user";
import { Chat, Message } from "@/types";
import { getColors } from "@/constants/Colors";
import { Text } from "../themed/Themed";
import { ThemedText } from "../themed/ThemedText";
import formatMessageTime from "@/utils/fornatMessageTime";
import ChatModal from "../modals/chat";

export default function ChatContainer({ chat }: { chat: Chat }) {
  const { user } = useContext(UserContext);
  const colors = getColors();
  const navigation = useRouter();

  const [visible, setVisible] = useState(false);

  const lastMessage = chat?.messages?.at(-1) as Message;
  const unreadMessagesCount = chat.messages.filter(
    (m) => !m.read && m.authorId !== user?.id
  ).length;

  const open = () => setVisible(true);

  return (
    user && (
      <TouchableOpacity
        style={styles.chatContainer}
        onPress={() =>
          navigation.navigate({
            pathname: "chat/chat",
            params: { id: chat.id },
          })
        }
        onLongPress={open}
      >
        <ChatModal chat={chat} visible={visible} setVisible={setVisible} />

        <View style={styles.chatLeft}>
          <Avatar
            size={55}
            name={chat.user.profile.username || chat.user.profile.name}
            source={
              chat.user.profile.avatar
                ? { uri: chat.user.profile.avatar }
                : undefined
            }
            colorize
            radius={50}
          />

          <View style={{ justifyContent: "center" }}>
            <Text style={styles.chatName}>{chat.user.profile.name}</Text>

            {lastMessage && (
              <View style={styles.messageRow}>
                {lastMessage.image ? (
                  <MaterialCommunityIcons
                    name="image"
                    size={20}
                    color={
                      lastMessage.authorId !== user.id
                        ? "gray"
                        : lastMessage.read
                        ? colors.tint
                        : "gray"
                    }
                    style={{ marginRight: 2 }}
                  />
                ) : lastMessage.authorId === user.id ? (
                  <Ionicons
                    name="checkmark-done"
                    size={20}
                    color={lastMessage.read ? colors.tint : "gray"}
                    style={{ marginRight: 2 }}
                  />
                ) : null}

                {lastMessage.image ? (
                  <ThemedText>{t("chat.isImageMessage")}</ThemedText>
                ) : (
                  <Text style={styles.messageContent}>
                    {lastMessage.content.length > 28
                      ? `${lastMessage.content.slice(0, 28)}...`
                      : lastMessage.content}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={styles.chatRight}>
          <Text style={styles.messageDate}>
            {lastMessage ? formatMessageTime(lastMessage.createdAt) : ""}
          </Text>
          {unreadMessagesCount > 0 && (
            <Text style={styles.unread}>{unreadMessagesCount}</Text>
          )}
        </View>
      </TouchableOpacity>
    )
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 8,
  },
  chatLeft: { flexDirection: "row", gap: 10 },
  chatRight: { alignItems: "center" },
  chatName: { fontWeight: "bold", fontSize: 17 },
  messageRow: { flexDirection: "row", alignItems: "center" },
  messageContent: { fontSize: 13, opacity: 0.8 },
  messageDate: { fontSize: 11, marginBottom: 3 },
  unread: {
    backgroundColor: "#2f95dc",
    borderRadius: 50,
    textAlign: "center",
    color: "white",
    paddingHorizontal: 5,
    minWidth: 20,
  },
  modal: { justifyContent: "flex-end", margin: 0 },
  scrollableModal: { minHeight: 500 },
  modalContent: {
    height: 500,
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTopProfile: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 50,
    gap: 10,
  },
  profileName: { fontWeight: "bold", fontSize: 15 },
  modalLinks: {},
  modalLink: { padding: 10, flexDirection: "row", alignItems: "center" },
  modalLinkText: { marginLeft: 10, fontSize: 17 },
  modalBarContainer: { justifyContent: "center", alignItems: "center" },
  modalBar: {
    backgroundColor: "#fff",
    width: 60,
    height: 6,
    borderRadius: 10,
    marginBottom: 5,
  },
});
