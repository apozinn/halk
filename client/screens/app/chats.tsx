import React, { useContext, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { RootTabScreenProps } from "../../types";
import { UserContext } from "../../src/contexts/user";
import { ChatsContext } from "../../src/contexts/chats";
import { SocketContext } from "../../src/contexts/socket";
import { getColors } from "../../constants/Colors";
import { SocketController } from "../../src/utils/socket";
import NewChatButton from "../../src/components/newChat";
import ChatContainer from "../../src/components/chatContainer";
import HalkController from '../../src/utils/halk';

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

    if (!chats.length) {
      chats.push(new HalkController().halkChat());
      updateChats({ chats });
    }
    if(!logged) return navigation.navigate("Welcome");

    updateUser({
      ...user,
      logged: false,
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {!logged ? (
        <></>
      ) : (<>
        <ScrollView
          style={{ padding: 5 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
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
        </ScrollView>
        <NewChatButton navigation={navigation} />
      </>)}
    </View>
  );
}
