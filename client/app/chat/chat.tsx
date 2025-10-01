import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Button,
  StatusBar,
  StyleSheet,
  View,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";
import { TextInput, Text } from "../../components/ui/Themed";
import { UserContext } from "@/contexts/user";
import { ChatsContext } from "@/contexts/chats";
import { SocketContext } from "@/contexts/socket";
import { CreateSocketConnection, SocketController } from "../../utils/socket";
import { getColors } from "../../constants/Colors";
import { Avatar } from '@kolking/react-native-avatar';
import MessagesContainer from "../../components/ui/messagesContainer";
import BottomContent from "../../components/ui/bottomContent";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";

const badgeProps = {
  size: 25,
  borderRadius: 50,
  animate: true,
};

export default function Chat({ route }) {
  const { user } = useContext(UserContext);
  const { chats, updateChats } = useContext(ChatsContext);
  const { socket } = useContext(SocketContext);
  const navigation = useRouter();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chat, setChat] = useState();
  const [online, setOnline] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  const colors = getColors();
  const scrollViewRef = useRef();

  const { id } = useLocalSearchParams();

  useEffect(() => {

    if (!socket || !user.id)
      return;

    const chatId = id;
    if (chatId) {
      const thisChat = chats.filter((c) => c.id === chatId)[0];
      if (thisChat) {
        setChat(thisChat);
      } else navigation.goBack();
    } else navigation.goBack();


  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (chat) {
        if (chat.messages.some((m) => m.id === msg.id)) return;
        chats.filter((c) => c.id === chat.id).map((c) => c.messages.push(msg));
        updateChats({ chats });
      }
    });
  }, [chat]);

  useEffect(() => {
    if (chat && socket) {
      new SocketController.joinedChat({ chats, updateChats, chat, socket });
      socket.on("receiveIfUserIsOnline", (callback) => setOnline(callback));
    }
  }, [chat]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!chat ? (
        <></>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
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
                  navigation.navigate("Profile", {
                    id: chat.user.id,
                  })
                }
                style={styles.userProfile}
              >
                {user.profile.avatar.length ? (
                  <Avatar
                    size={45}
                    name={user.profile.username}
                    source={{ uri: chat.user.profile.avatar }}
                    colorize={true}
                    radius={50}
                    badge={true}
                    badgeColor={"#919191"}
                    badgeProps={badgeProps}
                    style={{ marginRight: 10 }}
                  />
                ) : (
                  <Avatar
                    size={45}
                    name={chat.user.profile.avatar}
                    colorize={true}
                    radius={50}
                    style={{ marginRight: 10 }}
                  />
                )}
                <View style={{ display: "flex", flexDirection: "row", paddingLeft: "10"}}>
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                    {chat.user.profile.name}
                  </Text>
                  {userTyping ? (
                    <Text style={styles.isOnline}>{""}</Text>
                  ) : (
                    <Text style={styles.isOnline}>
                      {online ? "online" : ""}
                    </Text>
                  )}
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
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
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