import React, { useContext, useCallback } from "react";
import { StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Modal from "react-native-modal";
import { Avatar } from "@kolking/react-native-avatar";
import { t } from "i18next";
import { ThemedView } from "../themed/ThemedView";
import { ThemedText } from "../themed/ThemedText";
import { getColors } from "@/constants/Colors";
import { ChatsContext } from "@/contexts/chats";
import { Chat } from "@/types";

interface SelectChatModalProps {
  isVisible: boolean;
  SelectedChat: (chat: Chat) => void;
}

export default function SelectChatModal({
  isVisible,
  SelectedChat,
}: SelectChatModalProps) {
  const { chats } = useContext(ChatsContext);
  const colors = getColors();

  const renderItem = useCallback(
    ({ item }: { item: Chat }) => (
      <TouchableOpacity onPress={() => SelectedChat(item)}>
        <ThemedView
          style={[
            styles.chatContainer,
            { backgroundColor: colors.defaultColors.card },
          ]}
        >
          <Avatar
            size={55}
            name={item.user.profile.username || item.user.profile.name}
            source={
              item.user.profile.avatar
                ? { uri: item.user.profile.avatar }
                : undefined
            }
            colorize
            radius={50}
          />
          <ThemedText style={styles.usernameText}>
            {item.user.profile.username || item.user.profile.name}
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
    ),
    [SelectedChat, colors]
  );

  return (
    <Modal
      testID="selectChatModal"
      isVisible={isVisible}
      onSwipeComplete={() => {}}
      swipeDirection={["down"]}
      onBackdropPress={() => {}}
      style={styles.modal}
      propagateSwipe
      useNativeDriverForBackdrop
    >
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText style={styles.headerText}>
            {t("selectChatModal.title")}
          </ThemedText>
        </ThemedView>

        <FlatList
          data={chats}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.chatsContainer}
          showsVerticalScrollIndicator={false}
        />
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    alignItems: "center",
    margin: 0,
    padding: 0,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    maxHeight: "80%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  modalContent: {
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTopProfile: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 50,
  },
  modalLinks: {},
  modalLink: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  modalLinkText: {
    marginLeft: 10,
    fontSize: 17,
  },
  modalBarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalBar: {
    backgroundColor: "#fff",
    width: 60,
    height: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  chatContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
  },
  usernameText: {
    fontSize: 15,
    fontWeight: "500",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  chatsContainer: {
    gap: 12,
    paddingBottom: 24,
  },
});
