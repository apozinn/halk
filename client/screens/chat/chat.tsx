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
} from "react-native";
import {
  AntDesign,
  Ionicons,
  Feather,
  FontAwesome,
  MaterialIcons,
  Fontisto,
} from "@expo/vector-icons";
import { RootStackScreenProps } from "../../types";
import { TextInput, Text } from "../../src/components/Themed";
import { UserContext } from "../../src/contexts/user";
import { ChatsContext } from "../../src/contexts/chats";
import { SocketContext } from "../../src/contexts/socket";
import { SocketController } from "../../src/utils/socket";
import { getColors } from "../../constants/Colors";
import { Userpic } from "react-native-userpic";
import MessagesContainer from "../../src/components/messagesContainer";
import BottomContent from "../../src/components/bottomContent";

const badgeProps = {
  size: 25,
  borderRadius: 50,
  animate: true,
};

export default function Chat({ navigation, route }) {
  const { user } = useContext(UserContext);
  const { chats, updateChats } = useContext(ChatsContext);
  const socket = useContext(SocketContext);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chat, setChat] = useState();
  const [online, setOnline] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  const colors = getColors();
  const scrollViewRef = useRef();

  useEffect(() => {
    if (!user || !chats || !socket) return;

    const chatId = route.params.id;
    if (chatId) {
      var thisChat = chats.filter((c) => c.id === chatId)[0];
      if (thisChat) {
        setChat(thisChat);
      } else navigation.goBack();
    } else navigation.goBack();

    // socket.on("receiveMessage", (msg) => {
    //   if (chat.messages.some((m) => m.id === msg.id)) return;
    //   chats.filter((c) => c.id === chatId).map((c) => c.messages.push(msg));
    //   updateChats({ chats });
    // });
  }, []);

  useEffect(() => {
    if (chat && socket) {
      new SocketController.joinedChat({ chats, updateChats, chat, socket });
      // socket.on("receiveIfUserIsOnline", (callback) => setOnline(callback));
    }
  }, [chat]);

  return (
    <View style={styles.container}>
      {!chat ? (
        <></>
      ) : (
        <>
          <View
            style={[
              styles.topContainer,
              { backgroundColor: colors.defaultColors.card },
            ]}
          >
            <View style={styles.topContainerLeft}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Root")}
              >
                <AntDesign name="arrowleft" size={25} color={colors.tint} />
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
            <Userpic
              size={60}
              name={user.profile.username}
              source={{ uri: chat.user.profile.avatar }}
              colorize={true}
              borderRadius="50%"
              badge={true}
              badgeColor={"#919191"}
              badgePosition={"bottom-right"}
              badgeProps={badgeProps}
              style={{ marginRight: 10 }}
            />
          ) : (
            <Userpic
              size={60}
              name={chat.user.profile.avatar}
              colorize={true}
              borderRadius="50%"
              badge={true}
              badgeColor={"#919191"}
              badgePosition={"bottom-right"}
              badgeProps={badgeProps}
              style={{ marginRight: 10 }}
            />
          )}
                <View style={{ alignItems: "flex-start" }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {chat.user.profile.name}
                  </Text>
                  {userTyping ? (
                    <Text style={styles.isOnline}>Digitando...</Text>
                  ) : (
                    <Text style={styles.isOnline}>
                      {online ? "online" : ""}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.topContainerRight}>
              <TouchableOpacity style={styles.button} onPress={() => {}}>
                <Ionicons name="call" size={24} color={colors.tint} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => {}}>
                <FontAwesome
                  name="video-camera"
                  size={24}
                  color={colors.tint}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => {}}>
                <Feather name="more-vertical" size={24} color={colors.tint} />
              </TouchableOpacity>
            </View>
          </View>

          <MessagesContainer {...{ user, chats, updateChats, chat, colors }} />
          <BottomContent {...{ chat }} />
        </>
      )}
    </View>
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
