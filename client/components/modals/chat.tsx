import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import { Avatar } from "@kolking/react-native-avatar";
import {
  Ionicons,
  FontAwesome,
  AntDesign,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import Modal from "react-native-modal";
import { t } from "i18next";

import { ChatsContext } from "@/contexts/chats";
import { Chat } from "@/types";
import { getColors } from "@/constants/Colors";
import { ThemedText } from "../themed/ThemedText";

export default function ChatModal({
  chat,
  visible,
  setVisible,
}: {
  chat: Chat;
  visible: boolean | undefined;
  setVisible: Function;
}) {
  const { chats, updateChats } = useContext(ChatsContext);
  const colors = getColors();

  const [scrollOffset, setScrollOffset] = useState(0);

  const handleScroll = (e: any) =>
    setScrollOffset(e.nativeEvent.contentOffset.y);

  const close = () => setVisible(false);

  const removeChat = () => {
    let chatsBuffer = chats;
    chatsBuffer = chatsBuffer.filter((c) => c.id !== chat.id);
    updateChats(chatsBuffer);
    close();
  };

  return (
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
            <View
              style={[
                styles.modalTopProfile,
                { backgroundColor: colors.background },
              ]}
            >
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
              <ThemedText style={styles.profileName}>
                {chat.user.profile.name}
              </ThemedText>
            </View>

            <View>
              {[
                {
                  icon: (
                    <FontAwesome
                      name="user-circle"
                      size={26}
                      color={colors.tint}
                    />
                  ),
                  text: t("chat.profile"),
                },
                {
                  icon: <AntDesign name="star" size={26} color={colors.tint} />,
                  text: t("chat.pin"),
                },
                {
                  icon: (
                    <MaterialIcons
                      name="mark-chat-read"
                      size={26}
                      color={colors.tint}
                    />
                  ),
                  text: t("chat.markAsRead"),
                },
                {
                  icon: (
                    <MaterialIcons
                      name="notification-important"
                      size={26}
                      color={colors.tint}
                    />
                  ),
                  text: t("chat.notifications"),
                },
                {
                  icon: <Entypo name="block" size={26} color={colors.tint} />,
                  text: t("chat.blockUser"),
                },
                {
                  icon: (
                    <MaterialIcons
                      name="report"
                      size={26}
                      color={colors.tint}
                    />
                  ),
                  text: t("chat.reportUser"),
                },
                {
                  icon: <Ionicons name="copy" size={26} color={colors.tint} />,
                  text: t("chat.copyId"),
                },
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
                  <ThemedText style={styles.modalLinkText}>
                    {item.text}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
