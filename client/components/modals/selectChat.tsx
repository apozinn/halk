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
      <ThemedView style={styles.mainContainer}>
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
    margin: 0,
    justifyContent: "flex-end",
  },
  mainContainer: {
    maxHeight: "80%",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
});
