import React, { useEffect, useState, useContext, useRef } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";
import { UserContext } from "@/contexts/user";
import { ChatsContext } from "@/contexts/chats";
import { getColors } from "../../constants/Colors";
import { Avatar } from '@kolking/react-native-avatar';
import MessagesContainer from "../../components/chat/messagesContainer";
import BottomContent from "../../components/chat/bottomContent";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import { Chat } from "@/types";
import { SocketController } from "@/socket/socketController";
import { t } from "i18next";

export default function ChatScreen() {
  const { user } = useContext(UserContext);
  const { chats, updateChats } = useContext(ChatsContext);

  const navigation = useRouter();
  const [chat, setChat] = useState<Chat>();
  const [userIsOnline, setUserIsOnline] = useState<boolean>(false);
  const [userIsTyping, setUserIsTyping] = useState<boolean>(false);

  const colors = getColors();
  const { id } = useLocalSearchParams();
  const [chatId, setChatId] = useState(id);

  useEffect(() => {
    if (!user || !chat) return;
    const socketController = SocketController.getInstance({
      url: process.env.EXPO_PUBLIC_API_URL,
      token: user.id,
    });

    socketController.on("userTyping", (data:any) => {
      setUserIsTyping(data.typing);
    });

    socketController.emit("verifyIfUserIsOnline", { userId: chat.user.id });

    socketController.on("verifyIfUserIsOnline", (data:any) => {
      setUserIsOnline(data.isOnline);
    });

    return () => {
      socketController.off("verifyIfUserIsOnline");
    };

  }, []);

  useEffect(() => {
    if (!user) return;

    if (id) setChatId(id);

    if (chatId) {
      const thisChat = chats.filter((c) => c.id === chatId)[0];
      if (thisChat) {
        setChat(thisChat);
        return;
      }
      return;
    }

    navigation.back();
  }, [chats]);

  return chat && user ? (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.defaultColors.card }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ThemedView style={{ flex: 1 }}>
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
                  <AntDesign name="arrow-left" size={25} color={colors.tint} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate({
                      pathname: "/chat/profile",
                      params: { id: chat.user.id },
                    })
                  }
                  style={styles.userProfile}
                >
                  <Avatar
                      size={45}
                      name={chat.user.profile.avatar}
                      source={{ uri: chat.user.profile.avatar}}
                      colorize={true}
                      radius={50}
                    />
                  <View style={{ display: "flex", flexDirection: "row", paddingLeft: 10 }}>
                    <ThemedText style={{ fontWeight: "bold", fontSize: 18 }}>
                      {chat.user.profile.name}
                    </ThemedText>

                    <ThemedText style={styles.isOnline}>
                      {userIsTyping || userIsOnline ? `${userIsTyping ? t("chat.typing") : "online"}` : ""}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.topContainerRight}>
                <TouchableOpacity style={styles.button} onPress={() => { }}>
                  <Ionicons name="call" size={24} color={colors.tint} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => { }}>
                  <FontAwesome
                    name="video-camera"
                    size={24}
                    color={colors.tint}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => { }}>
                  <Feather name="more-vertical" size={24} color={colors.tint} />
                </TouchableOpacity>
              </View>
            </View>

            <MessagesContainer {...{ user, chats, updateChats, chat, colors }} />
            <BottomContent {...{ chat }} />
          </ThemedView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
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
    justifyContent: "center",
    alignContent: "center"
  },
  topContainerRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  messageContainer: {
    flex: 1,
    marginHorizontal: 10,
    flexDirection: "column-reverse",
    marginBottom: 55,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "rgb(18, 18, 18)",
    justifyContent: "space-between",
    borderRadius: 50,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 5,
    margin: 5,
  },
  messageCard: {
    borderWidth: 1,
    borderColor: "#222",
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 100,
    marginHorizontal: 5,
  },
  userProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    padding: 5,
  },
  blueButton: {
    backgroundColor: "#2f95dc",
    padding: 8,
    borderRadius: 100,
  },
  othersMedias: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputMessage: {
    paddingVertical: 8,
    width: "100%",
    marginLeft: 10,
  },
  buttonContentLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
  },
  isOnline: {
    fontSize: 13,
  },
});