import React, { useState, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import { Text } from "./Themed";
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

export default function ChatContainer(props) {
  const { user, chats, updateChats, chat, socket, colors } = props;
  const navigation = useRouter();

  const [visible, setVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(null);

  const lastMessage = useMemo(() => chat.messages[chat.messages.length - 1], [chat.messages]);

  const unredMessages = useMemo(() => 
    chat.messages.filter((m) => m.read === false && m.author.id !== user.id)
  , [chat.messages, user.id]);

  if (!lastMessage) return null;

  const messageTime = new Date(lastMessage.createdAt).toLocaleTimeString();
  
  const open = () => setVisible(true);
  const close = () => setVisible(false);

  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const handleScrollTo = (p) => {};

  const executeAction = (key, actionChat) => {
    try {
      if (key === "removeChat") {
        const updatedChats = chats.filter((c) => c.id !== actionChat.id);
        if (updatedChats) {
          updateChats({ chats: updatedChats }); 
          close();
        }
      }
    } catch (err) { }
  };

  if (socket?.emit) {
    socket.emit("verifyIfUserIsOnline", { userId: chat.user.id });
    socket.on(
      "receiveIfUserIsOnline",
      (callback) => setIsOnline(callback)
    );
  }

  const ModalChat = () => {
    return (
      <Modal
        testID={"ModalChat"}
        isVisible={visible}
        onSwipeComplete={close}
        swipeDirection={["down"]}
        scrollTo={handleScrollTo}
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
                  { backgroundColor: colors.background },
                ]}
              >
                <Avatar
                  size={60}
                  name={chat.user.profile.username || chat.user.profile.name}
                  source={{ uri: chat.user.profile.avatar || undefined }}
                  colorize={true}
                  radius={50}
                  style={{ marginRight: 10 }}
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
                <TouchableOpacity
                  style={styles.modalLink}
                  onPress={() => executeAction("removeChat", chat)}
                >
                  <MaterialIcons name="delete" size={26} color={colors.tint} />
                  <Text style={styles.modalLinkText}>Excluir conversa</Text>
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
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
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

      <View style={{ flexDirection: "row" }}>
        <Avatar
          size={55}
          name={chat.user.profile.username || chat.user.profile.name}
          source={chat.user.profile.username == "Halk team" ? require("@/assets/images/halk.png") : require("@/assets/images/userIcon.png")}
          colorize={true}
          radius={50}
          style={{ marginRight: 10 }}
        />
        <View style={{ justifyContent: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>
            {chat.user.profile.name}
          </Text>
          {lastMessage.author.id === user.id ? (
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
        </View>
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.messageDate}>{messageTime.slice(0, 5)}</Text> 
        {unredMessages.length > 0 && (
          <Text style={styles.unread}>{unredMessages.length}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
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