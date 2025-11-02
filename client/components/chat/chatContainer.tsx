import React, { useState, useContext } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Avatar } from "@kolking/react-native-avatar";
import {
  Ionicons,
  FontAwesome,
  AntDesign,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Modal from "react-native-modal";
import { useRouter } from "expo-router";
import { t } from "i18next";

import { ChatsContext } from "@/contexts/chats";
import { UserContext } from "@/contexts/user";
import { Chat, Message } from "@/types";
import { getColors } from "@/constants/Colors";
import { Text } from "../themed/Themed";
import { ThemedText } from "../themed/ThemedText";

export default function ChatContainer({ chat }: { chat: Chat }) {
  const { user } = useContext(UserContext);
  const { chats, updateChats } = useContext(ChatsContext);
  const colors = getColors();
  const navigation = useRouter();

  const [visible, setVisible] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  const lastMessage = chat?.messages?.at(-1) as Message;
  const unreadMessagesCount = chat.messages.filter(
    (m) => !m.read && m.authorId !== user?.id
  ).length;

  const handleScroll = (e: any) =>
    setScrollOffset(e.nativeEvent.contentOffset.y);

  const close = () => setVisible(false);
  const open = () => setVisible(true);

  const removeChat = () => {
    updateChats(chats.filter((c) => c.id !== chat.id));
    close();
  };

  const ModalChat = () => (
    <Modal
      isVisible={visible}
      onSwipeComplete={close}
      swipeDirection={["down"]}
      scrollOffset={scrollOffset}
      scrollOffsetMax={100}
      propagateSwipe
      style={styles.modal}
      onBackButtonPress={close}
      onBackdropPress={close}
    >
      <View style={styles.scrollableModal}>
        <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
          <View style={styles.modalBarContainer}>
            <View style={styles.modalBar} />
          </View>

          <View
            style={[
              styles.modalContent,
              {
                backgroundColor:
                  colors.theme === "dark"
                    ? colors.defaultColors.card
                    : colors.defaultColors.background,
              },
            ]}
          >
            <View style={[styles.modalTopProfile, { backgroundColor: colors.background }]}>
              <Avatar
                size={60}
                name={chat.user.profile.username || chat.user.profile.name}
                source={
                  chat.user.profile.avatar
                    ? { uri: chat.user.profile.avatar }
                    : undefined
                }
                colorize
                radius={50}
              />
              <Text style={styles.profileName}>
                {chat.user.profile.name}
              </Text>
            </View>

            <View style={styles.modalLinks}>
              {[
                { icon: <FontAwesome name="user-circle" size={26} color={colors.tint} />, text: t("chat.profile") },
                { icon: <AntDesign name="star" size={26} color={colors.tint} />, text: t("chat.pin") },
                { icon: <MaterialIcons name="mark-chat-read" size={26} color={colors.tint} />, text: t("chat.markAsRead") },
                { icon: <MaterialIcons name="notification-important" size={26} color={colors.tint} />, text: t("chat.notifications") },
                { icon: <Entypo name="block" size={26} color={colors.tint} />, text: t("chat.blockUser") },
                { icon: <MaterialIcons name="report" size={26} color={colors.tint} />, text: t("chat.reportUser") },
                { icon: <Ionicons name="copy" size={26} color={colors.tint} />, text: t("chat.copyId") },
                {
                  icon: <MaterialIcons name="delete" size={26} color="red" />,
                  text: t("chat.deleteChat"),
                  onPress: removeChat,
                },
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalLink}
                  onPress={item.onPress}
                >
                  {item.icon}
                  <Text style={styles.modalLinkText}>{item.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  if (!user) return null;

  return (
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
      {ModalChat()}

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
          {lastMessage
            ? new Date(lastMessage.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              })
            : ""}
        </Text>
        {unreadMessagesCount > 0 && (
          <Text style={styles.unread}>{unreadMessagesCount}</Text>
        )}
      </View>
    </TouchableOpacity>
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
