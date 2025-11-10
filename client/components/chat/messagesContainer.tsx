import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
  FlatList
} from "react-native";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { Text } from "../themed/Themed";
import Modal from "react-native-modal";
import { Avatar } from "@kolking/react-native-avatar";
import { Chat, Message, User } from "@/types";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import * as FileSystem from "expo-file-system/legacy";

interface MessagesContainerProps {
  user: User;
  chat: Chat;
  colors: any;
  setMessageModal: (message: Message) => void
}

export default function MessagesContainer({
  user,
  chat,
  colors,
  setMessageModal
}: MessagesContainerProps) {
  const listRef = useRef<FlatList>(null);

  function MessageBubble({ message, index }: { message: Message, index: number }) {
    if (!message?.authorId) return null;

    const itsMyMessage = message.authorId === user.id;
    const messageTime = new Date(message.createdAt).toLocaleTimeString();

    const prevMsg = chat.messages[index - 1];
    const nextMsg = chat.messages[index + 1];

    const previousMessageIsMy = prevMsg?.authorId === message.authorId;
    const nextMessageIsMy = nextMsg?.authorId === message.authorId;

    const borders: any = {};

    if (itsMyMessage) {
      borders.borderTopRightRadius =
        previousMessageIsMy && !nextMessageIsMy ? 5 : 15;
      borders.borderBottomRightRadius =
        !previousMessageIsMy && nextMessageIsMy ? 5 : 15;
      if (previousMessageIsMy && nextMessageIsMy) {
        borders.borderTopRightRadius = 5;
        borders.borderBottomRightRadius = 5;
      }
    } else {
      borders.borderTopLeftRadius =
        previousMessageIsMy && !nextMessageIsMy ? 5 : 15;
      borders.borderBottomLeftRadius =
        !previousMessageIsMy && nextMessageIsMy ? 5 : 15;
      if (previousMessageIsMy && nextMessageIsMy) {
        borders.borderTopLeftRadius = 5;
        borders.borderBottomLeftRadius = 5;
      }
    }

    return (
      <View
        style={[
          itsMyMessage ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <View style={itsMyMessage ? { maxWidth: "75%" } : {}}>
          <Pressable
            style={[
              styles.message,
              borders,
              {
                backgroundColor: itsMyMessage
                  ? "#2f95dc"
                  : colors.otherUserMessageCard,
              },
            ]}
            {...(message?.image && {
              onPress: () => {
                router.navigate({
                  pathname: "chat/imageView",
                  params: { image: message?.image },
                })
              }
            })}
            onLongPress={() => {
              setMessageModal(message);
            }}
          >
            {message?.image && (
              <Image
                source={{ uri: message?.image }}
                style={styles.messageImage}
              />
            )}
            {message.content && (
              <Text
                style={{
                  maxWidth: "100%",
                  color: itsMyMessage
                    ? "white"
                    : colors.defaultColors.text,
                }}
              >
                {message.content}
              </Text>
            )}
          </Pressable>
          <View
            style={[
              styles.messageProps,
              {
                justifyContent: itsMyMessage ? "flex-end" : "flex-start",
              },
            ]}
          >
            {!nextMessageIsMy && (
              <>
                <Text style={styles.messageCreatedAt}>
                  {messageTime.slice(0, 5)}
                </Text>
                {itsMyMessage && (
                  <Ionicons
                    name="checkmark-done"
                    size={20}
                    color={message.read ? "#04f500" : "gray"}
                    style={{ marginRight: 2 }}
                  />
                )}
              </>
            )}
          </View>
        </View>
      </View>
    );
  }

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [chat, chat.messages]);

  return chat && (
    <FlatList
      ref={listRef}
      data={chat.messages}
      renderItem={({ item, index }) => <MessageBubble message={item} index={index} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  myMessage: {
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  otherMessage: {
    alignSelf: "flex-start",
    maxWidth: "75%",
  },
  message: {
    padding: 7,
    borderRadius: 20,
    flexDirection: "row",
    marginBottom: 2,
    alignItems: "baseline",
    flexWrap: "wrap",
  },
  messageCreatedAt: {
    fontSize: 10,
    marginHorizontal: 5,
    marginTop: 5,
  },
  messageProps: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageImage: {
    width: "100%",
    height: 200,
    borderRadius: 20,
  }
});
