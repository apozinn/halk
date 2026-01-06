import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { AntDesign, Ionicons, Feather, FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "@kolking/react-native-avatar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { t } from "i18next";

import { UserContext } from "@/contexts/user";
import { ChatsContext } from "@/contexts/chats";
import { getColors } from "@/constants/Colors";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import MessagesContainer from "@/components/chat/messagesContainer";
import BottomContent from "@/components/chat/bottomContent";
import MessageModal from "@/components/modals/message";
import { Chat, Message } from "@/types";
import { SocketController } from "@/socket/socketController";

export default function ChatScreen() {
  const { user } = useContext(UserContext);
  const { chats, updateChats } = useContext(ChatsContext);

  const navigation = useRouter();
  const { id } = useLocalSearchParams();

  const [chat, setChat] = useState<Chat>();
  const [messageModal, setMessageModal] = useState<Message>();
  const [userIsOnline, setUserIsOnline] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);

  const colors = getColors();

  const [socket, setSocket] = useState<SocketController>();

  useEffect(() => {
    if (!id || !chats.length || !user) return;

    const currentChat = chats.find((c) => c.id === id);
    if (!currentChat) {
      navigation.back();
      return;
    }

    if (currentChat.messages.length === chat?.messages.length) return;

    setChat(currentChat);

    currentChat.messages
      .filter((m) => m.authorId !== user.id && !m.read)
      .map((m) => (m.read = true));
  }, [chats, id]);

  useEffect(() => {
    if (!user || !chat) return;

    setSocket(
      SocketController.getInstance({
        url: process.env.EXPO_PUBLIC_API_URL,
        token: user.id,
      })
    );

    if (!socket) return;

    socket.emit("verifyIfUserIsOnline", { userId: chat.user.id });

    socket.emit("readMessage", {
      chat: chat.id,
      reader: user.id,
      messageAuthor: chat.user.id,
    });

    const handleTyping = (data: any) => setUserIsTyping(data.typing);
    const handleOnline = (data: any) => setUserIsOnline(data.isOnline);

    socket.on("userTyping", handleTyping);
    socket.on("verifyIfUserIsOnline", handleOnline);

    return () => {
      socket.off("userTyping", handleTyping);
      socket.off("verifyIfUserIsOnline", handleOnline);
    };
  }, [user, chat]);

  if (!chat || !user) return null;

  return (
    <>
      <MessageModal
        messageModal={messageModal}
        setMessageModal={setMessageModal}
      />

      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: colors.defaultColors.card },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <ThemedView style={styles.container}>
              <View
                style={[
                  styles.topContainer,
                  { backgroundColor: colors.defaultColors.card },
                ]}
              >
                <View style={styles.topContainerLeft}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("/")}
                  >
                    <AntDesign
                      name="arrow-left"
                      size={25}
                      color={colors.tint}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate({
                        pathname: "/chat/profile",
                        params: { chatId: chat.id },
                      })
                    }
                    style={styles.userProfile}
                  >
                    <Avatar
                      size={45}
                      name={chat.user.profile.avatar}
                      source={{ uri: chat.user.profile.avatar }}
                      colorize
                      radius={50}
                    />

                    <View style={styles.userInfo}>
                      <ThemedText style={styles.username}>
                        {chat.user.profile.name}
                      </ThemedText>

                      <ThemedText style={styles.isOnline}>
                        {userIsTyping
                          ? t("chat.typing")
                          : userIsOnline
                          ? "online"
                          : ""}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.topContainerRight}>
                  <TouchableOpacity style={styles.button}>
                    <Ionicons name="call" size={24} color={colors.tint} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button}>
                    <FontAwesome
                      name="video-camera"
                      size={24}
                      color={colors.tint}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button}>
                    <Feather
                      name="more-vertical"
                      size={24}
                      color={colors.tint}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <MessagesContainer
                {...{ user, chats, updateChats, chat, colors, setMessageModal }}
              />
              <BottomContent chat={chat} />
            </ThemedView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    justifyContent: "space-between",
  },
  topContainerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  topContainerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  userProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 18,
  },
  isOnline: {
    fontSize: 13,
    marginLeft: 6,
  },
  button: {
    padding: 5,
  },
});
