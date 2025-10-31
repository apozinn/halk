import React, { useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { UserContext } from "@/contexts/user";
import { ChatsContext } from "@/contexts/chats";
import { getColors } from "../../constants/Colors";
import NewChatButton from "../../components/ui/newChatButton";
import ChatContainer from "../../components/chat/chatContainer";
import { ThemedView } from "@/components/themed/ThemedView";
import { Chat } from "@/types";

export default function Chats() {
  const { user, logged } = useContext(UserContext);
  const { chats } = useContext(ChatsContext);
  const [chatsTobeListed, setChatsTobeListed] = useState<Chat[]>([]);

  useEffect(() => {
    if(chats) {
      setChatsTobeListed(chats);
    }
  }, [chats]);

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
          {<>{chatsTobeListed.map((chat) => {
            return <ChatContainer key={chat.id} chat={chat} />
          })}</>}
        </ScrollView>
        <NewChatButton />
      </>)}
    </ThemedView>
  );
}
