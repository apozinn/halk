import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import { Text } from "../themed/Themed";
import { Avatar } from '@kolking/react-native-avatar';
import {
  Ionicons,
  FontAwesome,
  AntDesign,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import Modal from "react-native-modal";
import { useRouter } from "expo-router";
import { ChatsContext } from "@/contexts/chats";
import { UserContext } from "@/contexts/user";
import { Chat, Message } from "@/types";
import { getColors } from "@/constants/Colors";

export default function ChatContainer({ chat }: { chat: Chat }) {
  const { user } = useContext(UserContext);
  const { chats, updateChats } = useContext(ChatsContext);

  const lastMessage : Message = chat?.messages?.at(-1) as Message
  const unreadMessagesCount = chat.messages.filter((m) => m.read === false && m?.authorId !== user?.id).length;

  const colors = getColors();
  const navigation = useRouter();

  const [visible, setVisible] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  const handleOnScroll = (event: any) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const executeAction = (key: string, actionChat: Chat) => {
    try {
      if (key === "removeChat") {
        const updatedChats = chats.filter((c) => c.id !== actionChat.id);
        updateChats(updatedChats);
        close();
      }
    } catch (err) {
      alert(err);
    }
  };

  const ModalChat = () => {
    return (
      <Modal
        testID={"ModalChat"}
        isVisible={visible}
        onSwipeComplete={close}
        swipeDirection={["down"]}
        scrollOffset={scrollOffset}
        scrollOffsetMax={100}
        propagateSwipe={true}
        style={styles.modal}
        onBackButtonPress={close}
        onBackdropPress={close}
      >
        <View style={styles.scrollableModal}>
          <ScrollView
            onScroll={handleOnScroll}
            scrollEventThrottle={16}
          >
            <View style={styles.modalBarContainer}>
              <View style={styles.modalBar}></View>
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
                  { backgroundColor: colors.background, gap: 10 },
                ]}
              >
                <Avatar
                  size={60}
                  name={chat.user.profile.username || chat.user.profile.name}
                  source={{ uri: chat.user.profile.avatar || undefined }}
                  colorize={true}
                  radius={50}
                />
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  {chat.user.profile.name}
                </Text>
              </View>

              <View style={styles.modalLinks}>
                <TouchableOpacity style={styles.modalLink}>
                  <FontAwesome name="user-circle" size={26} color={colors.tint} />
                  <Text style={styles.modalLinkText}>Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLink}>
                  <AntDesign name="star" size={26} color={colors.tint} />
                  <Text style={styles.modalLinkText}>Fixar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLink}>
                  <MaterialIcons name="mark-chat-read" size={26} color={colors.tint} />
                  <Text style={styles.modalLinkText}>Marcar como lida</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLink}>
                  <MaterialIcons name="notification-important" size={26} color={colors.tint} />
                  <Text style={styles.modalLinkText}>Config. de notificação</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalLink}>
                  <Entypo name="block" size={26} color={colors.tint} />
                  <Text style={styles.modalLinkText}>Bloquear usuário</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLink}>
                  <MaterialIcons name="report" size={26} color={colors.tint} />
                  <Text style={styles.modalLinkText}>Denúnciar usuário</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLink}>
                  <Ionicons name="copy" size={26} color={colors.tint} />
                  <Text style={styles.modalLinkText}>Copiar ID</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalLink}
                  onPress={() => executeAction("removeChat", chat)}
                >
                  <MaterialIcons name="delete" size={26} color={"red"} />
                  <Text style={styles.modalLinkText}>Excluir conversa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return user && (
    <TouchableOpacity
      style={styles.chatContainer}
      onPress={() => {
        navigation.navigate({
          pathname: "chat/chat",
          params: { id: chat.id },
        });
      }}
      onLongPress={open}
    >
      {ModalChat()}

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Avatar
          size={55}
          name={chat.user.profile.username || chat.user.profile.name}
          source={chat.user.profile.avatar ? { uri: chat.user.profile.avatar } : undefined}
          colorize={true}
          radius={50}
        />
        <View style={{ justifyContent: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>
            {chat.user.profile.name}
          </Text>
          {
            lastMessage?.id && (<>
              {lastMessage.authorId !== user.id ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="checkmark-done"
                    size={20}
                    color={lastMessage.read ? "#2f95dc" : "gray"}
                    style={{ marginRight: 2 }}
                  />
                  <Text style={styles.messageContent}>
                    {lastMessage.content.length > 28 ? `${lastMessage.content.slice(0, 28)}...` : lastMessage.content}
                  </Text>
                </View>
              ) : (
                <Text style={styles.messageContent}>
                  {lastMessage.content.length > 30 ? `${lastMessage.content.slice(0, 30)}...` : lastMessage.content}
                </Text>
              )}
            </>)
          }
        </View>
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.messageDate}>
          {lastMessage ? new Date(lastMessage.createdAt).toDateString().slice(0, 5) : ""}
        </Text>
        {unreadMessagesCount > 0 && (
          <Text style={styles.unread}>{unreadMessagesCount}</Text>
        )}
      </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  chatContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 5,
  },
  messageContent: {
    fontSize: 13,
    opacity: 0.8,
    alignItems: "center",
  },
  messageDate: {
    fontSize: 11,
    marginBottom: 3,
  },
  unread: {
    backgroundColor: "#2f95dc",
    borderRadius: 50,
    textAlign: "center",
    color: "white",
    paddingHorizontal: 5,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  scrollableModal: {
    minHeight: 500,
  },
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
});