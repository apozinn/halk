import React, { useContext, useEffect } from "react";
import { ScrollView } from "react-native";
import { UserContext } from "@/contexts/user";
import { ChatsContext } from "@/contexts/chats";
import { SocketContext } from "@/contexts/socket";
import { getColors } from "../../constants/Colors";
import { SocketController } from "../../utils/socket";
import NewChatButton from "../../components/ui/newChatButton";
import ChatContainer from "../../components/ui/chatContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";

export default function Chats() {
  const { user, logged, updateUser } = useContext(UserContext);
  const { chats, updateChats } = useContext(ChatsContext);
  const { socket } = useContext(SocketContext);
  const colors = getColors();

  useEffect(() => {
    if (user && chats && socket) {
      new SocketController({
        user,
        updateUser,
        chats,
        updateChats,
        socket,
      });
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1}}>
        {!logged ? (
          <></>
        ) : (<>
          <ScrollView
            style={{ flex: 1, padding: 5 }}
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
                  socket,
                  colors,
                }}
                key={index}
              />
            ))}
          </ScrollView>
          <NewChatButton />
        </>)}
      </ThemedView>
    </SafeAreaView>
  );
}
