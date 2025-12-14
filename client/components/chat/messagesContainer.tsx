import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../themed/Themed";
import { Chat, Message, User } from "@/types";
import { router } from "expo-router";
import * as VideoThumbnails from "expo-video-thumbnails";

interface MessagesContainerProps {
  user: User;
  chat: Chat;
  colors: any;
  setMessageModal: (message: Message) => void;
}

/* ----------------------------- Helpers ----------------------------- */

function getBubbleBorders(
  itsMyMessage: boolean,
  prevSame: boolean,
  nextSame: boolean
) {
  const radiusBig = 18;
  const radiusSmall = 6;

  if (itsMyMessage) {
    return {
      borderTopRightRadius: prevSame && !nextSame ? radiusSmall : radiusBig,
      borderBottomRightRadius: !prevSame && nextSame ? radiusSmall : radiusBig,
    };
  }

  return {
    borderTopLeftRadius: prevSame && !nextSame ? radiusSmall : radiusBig,
    borderBottomLeftRadius: !prevSame && nextSame ? radiusSmall : radiusBig,
  };
}

/* -------------------------- MessageBubble --------------------------- */

interface MessageBubbleProps {
  message: Message;
  index: number;
  chat: Chat;
  user: User;
  colors: any;
  setMessageModal: (message: Message) => void;
}

const MessageBubble = memo(
  ({ message, index, chat, user, colors, setMessageModal }: MessageBubbleProps) => {
    const [videoThumb, setVideoThumb] = useState<string | null>(null);

    const itsMyMessage = message.authorId === user.id;

    const prevMsg = chat.messages[index - 1];
    const nextMsg = chat.messages[index + 1];

    const previousMessageIsSameAuthor = prevMsg?.authorId === message.authorId;
    const nextMessageIsSameAuthor = nextMsg?.authorId === message.authorId;

    const messageTime = useMemo(
      () => new Date(message.createdAt).toLocaleTimeString().slice(0, 5),
      [message.createdAt]
    );

    /* ---------- Video thumbnail ---------- */
    useEffect(() => {
      if (!message.video) return;

      let active = true;

      VideoThumbnails.getThumbnailAsync(message.video, {
        time: 1000,
        quality: 0.8,
      })
        .then(({ uri }) => {
          if (active) setVideoThumb(uri);
        })
        .catch(() => {});

      return () => {
        active = false;
      };
    }, [message.video]);

    /* ---------- Handlers ---------- */
    const handlePress = useCallback(() => {
      if (message.image) {
        router.navigate({
          pathname: "chat/imageView",
          params: { image: message.image },
        });
      } else if (message.video) {
        router.navigate({
          pathname: "chat/videoView",
          params: { video: message.video },
        });
      }
    }, [message.image, message.video]);

    const handleLongPress = useCallback(() => {
      setMessageModal(message);
    }, [message, setMessageModal]);

    const bubbleBorders = useMemo(
      () =>
        getBubbleBorders(
          itsMyMessage,
          previousMessageIsSameAuthor,
          nextMessageIsSameAuthor
        ),
      [itsMyMessage, previousMessageIsSameAuthor, nextMessageIsSameAuthor]
    );

    return (
      <View style={itsMyMessage ? styles.myMessage : styles.otherMessage}>
        <View style={itsMyMessage ? styles.myMessageWrapper : undefined}>
          <Pressable
            style={[
              styles.message,
              bubbleBorders,
              {
                backgroundColor: itsMyMessage
                  ? "#2f95dc"
                  : colors.otherUserMessageCard,
              },
            ]}
            onPress={handlePress}
            onLongPress={handleLongPress}
          >
            {message.image && (
              <Image
                source={{ uri: message.image }}
                style={styles.messageImage}
              />
            )}

            {message.video && (
              <View style={styles.videoContainer}>
                {!!videoThumb && (
                  <Image
                    source={{ uri: videoThumb }}
                    style={styles.videoThumb}
                    resizeMode="contain"
                  />
                )}
                <View style={styles.playOverlay}>
                  <Ionicons name="play" size={34} color="#fff" />
                </View>
              </View>
            )}

            {!!message.content && (
              <Text
                style={{
                  color: itsMyMessage
                    ? "white"
                    : colors.defaultColors.text,
                }}
              >
                {message.content}
              </Text>
            )}
          </Pressable>

          {!nextMessageIsSameAuthor && (
            <View
              style={[
                styles.messageProps,
                { justifyContent: itsMyMessage ? "flex-end" : "flex-start" },
              ]}
            >
              <Text style={styles.messageCreatedAt}>{messageTime}</Text>

              {itsMyMessage && (
                <Ionicons
                  name="checkmark-done"
                  size={18}
                  color={message.read ? "#04f500" : "gray"}
                />
              )}
            </View>
          )}
        </View>
      </View>
    );
  }
);

/* ------------------------ MessagesContainer ------------------------- */

export default function MessagesContainer({
  user,
  chat,
  colors,
  setMessageModal,
}: MessagesContainerProps) {
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [chat.messages.length]);

  const renderItem = useCallback(
    ({ item, index }: { item: Message; index: number }) => (
      <MessageBubble
        message={item}
        index={index}
        chat={chat}
        user={user}
        colors={colors}
        setMessageModal={setMessageModal}
      />
    ),
    [chat, user, colors, setMessageModal]
  );

  return (
    <FlatList
      ref={listRef}
      data={chat.messages}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      initialNumToRender={12}
      windowSize={7}
      removeClippedSubviews
    />
  );
}

/* ------------------------------- Styles ------------------------------ */

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  myMessage: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  myMessageWrapper: {
    maxWidth: "75%",
  },
  otherMessage: {
    alignSelf: "flex-start",
    maxWidth: "75%",
  },
  message: {
    padding: 7,
    borderRadius: 20,
    marginBottom: 2,
    flexWrap: "wrap",
  },
  messageProps: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageCreatedAt: {
    fontSize: 10,
    marginHorizontal: 5,
    marginTop: 5,
  },
  messageImage: {
    width: 240,
    height: 300,
    borderRadius: 20,
  },
  videoContainer: {
    width: 240,
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  videoThumb: {
    width: "100%",
    height: "100%",
  },
  playOverlay: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
});
