import React, { useContext } from "react";
import { ScrollView } from "react-native";
import { UserContext } from "@/contexts/user";
import { ChatsContext } from "@/contexts/chats";
import { getColors } from "../../constants/Colors";
import NewChatButton from "../../components/ui/newChatButton";
import ChatContainer from "../../components/chat/chatContainer";
import { ThemedView } from "@/components/themed/ThemedView";

export default function Chats() {
  const { user, logged } = useContext(UserContext);
  const { chats } = useContext(ChatsContext);
  const colors = getColors();

  return (
    <ThemedView style={{ flex: 1 }}>
      {!logged ? (
        <></>
      ) : (<>
        <ScrollView
          style={{ flex: 1, padding: 5 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {chats ? (
            chats.map((chat) => (
              <ChatContainer
                key={chat.id}
                chat={chat}
                user={user}
                colors={colors}
              />
            ))
          ) : (
            <></>
          )}
        </ScrollView>
        <NewChatButton />
      </>)}
    </ThemedView>
  );
}
