import React, { useContext, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { RootTabScreenProps } from "../../types";
import { UserContext } from "../../src/contexts/user";
import { ChatsContext } from "../../src/contexts/chats";
import { SocketContext } from "../../src/contexts/socket";
import { getColors } from "../../constants/Colors";
import { Cipher, Decipher } from "../../middleware/crypto";
import { SocketController } from "../../src/utils/socket";
import NewChatButton from "../../src/components/newChat";
import ChatContainer from "../../src/components/chatContainer";

export default function Chats({ navigation }) {
  const { user, logged, updateUser } = useContext(UserContext);
  const { chats, updateChats } = useContext(ChatsContext);
  const socket = useContext(SocketContext);
  const colors = getColors();

  useEffect(() => {
    if (!user || !chats || !socket) return;
    new SocketController({
      user,
      updateUser,
      chats,
      updateChats,
      socket,
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {!logged ? (
        <>{navigation.navigate("Welcome")}</>
      ) : (
        <ScrollView
          style={{ padding: 5 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {!chats.length ? (
            <ChatContainer
              chat={new SocketController.sendHalkMessage()}
              {...{ user, chats, navigation, socket, colors }}
            />
          ) : (
            <>
              {chats.map((chat, index) => (
                <ChatContainer
                  {...{
                    user,
                    chats,
                    updateChats,
                    chat,
                    navigation,
                    socket,
                    colors,
                  }}
                  key={index}
                />
              ))}
            </>
          )}
        </ScrollView>
      )}
      <NewChatButton navigation={navigation} />
    </View>
  );
}
