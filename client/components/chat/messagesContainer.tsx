import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
  ListRenderItem,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../themed/Themed";
import { Message } from "@/types";
import { router } from "expo-router";
import * as VideoThumbnails from "expo-video-thumbnails";

const getBubbleBorders = (
  itsMyMessage: boolean,
  prevSame: boolean,
  nextSame: boolean,
) => {
  const radiusBig = 18;
  const radiusSmall = 6;
  if (itsMyMessage) {
    return {
      borderTopRightRadius: prevSame ? radiusSmall : radiusBig,
      borderBottomRightRadius: nextSame ? radiusSmall : radiusBig,
    };
  }
  return {
    borderTopLeftRadius: prevSame ? radiusSmall : radiusBig,
    borderBottomLeftRadius: nextSame ? radiusSmall : radiusBig,
  };
};

interface MessageBubbleProps {
  message: Message;
  itsMyMessage: boolean;
  isPrevSame: boolean;
  isNextSame: boolean;
  colors: any;
  setMessageModal: (message: Message) => void;
}

const MessageBubble = memo(
  ({
    message,
    itsMyMessage,
    isPrevSame,
    isNextSame,
    colors,
    setMessageModal,
  }: MessageBubbleProps) => {
    const [videoThumb, setVideoThumb] = useState<string | null>(null);

    const messageTime = useMemo(
      () => new Date(message.createdAt).toLocaleTimeString().slice(0, 5),
      [message.createdAt],
    );

    useEffect(() => {
      if (!message.video) return;
      let isMounted = true;
      VideoThumbnails.getThumbnailAsync(message.video, {
        time: 1000,
        quality: 0.5,
      })
        .then((thumb) => isMounted && setVideoThumb(thumb.uri))
        .catch(() => {});
      return () => {
        isMounted = false;
      };
    }, [message.video]);

    const bubbleBorders = useMemo(
      () => getBubbleBorders(itsMyMessage, isPrevSame, isNextSame),
      [itsMyMessage, isPrevSame, isNextSame],
    );

    return (
      <View
        style={[
          itsMyMessage ? styles.myMessage : styles.otherMessage,
          { marginBottom: isNextSame ? 2 : 10 },
        ]}
      >
        <View
          style={itsMyMessage ? styles.myMessageWrapper : { maxWidth: "75%" }}
        >
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
            onPress={() => {
              if (message.image)
                router.navigate({
                  pathname: "chat/imageView",
                  params: { image: message.image },
                });
              if (message.video)
                router.navigate({
                  pathname: "chat/videoView",
                  params: { video: message.video },
                });
            }}
            onLongPress={() => setMessageModal(message)}
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
                  color: itsMyMessage ? "white" : colors.defaultColors.text,
                }}
              >
                {message.content}
              </Text>
            )}
          </Pressable>

          {!isNextSame && (
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
                  size={16}
                  color={message.read ? "#04f500" : "gray"}
                />
              )}
            </View>
          )}
        </View>
      </View>
    );
  },
  (prev, next) => {
    return (
      prev.message.id === next.message.id &&
      prev.message.read === next.message.read &&
      prev.isPrevSame === next.isPrevSame &&
      prev.isNextSame === next.isNextSame
    );
  },
);

export default function MessagesContainer({
  user,
  chat,
  colors,
  setMessageModal,
}: any) {
  const invertedData = useMemo(
    () => [...chat.messages].reverse(),
    [chat.messages],
  );

  const renderItem: ListRenderItem<Message> = useCallback(
    ({ item, index }) => {
      const isPrevSame = invertedData[index + 1]?.authorId === item.authorId;
      const isNextSame = invertedData[index - 1]?.authorId === item.authorId;

      return (
        <MessageBubble
          message={item}
          itsMyMessage={item.authorId === user.id}
          isPrevSame={isPrevSame}
          isNextSame={isNextSame}
          colors={colors}
          setMessageModal={setMessageModal}
        />
      );
    },
    [invertedData, user.id, colors, setMessageModal],
  );

  return (
    <FlatList
      data={invertedData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      inverted
      contentContainerStyle={styles.content}
      removeClippedSubviews={true}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  myMessage: { flexDirection: "row", justifyContent: "flex-end" },
  myMessageWrapper: { maxWidth: "75%" },
  otherMessage: { alignSelf: "flex-start" },
  message: { padding: 8, borderRadius: 18 },
  messageProps: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  messageCreatedAt: { fontSize: 10, marginHorizontal: 4, color: "gray" },
  messageImage: { width: 240, height: 300, borderRadius: 12 },
  videoContainer: {
    width: 240,
    height: 300,
    borderRadius: 12,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  videoThumb: { width: "100%", height: "100%", position: "absolute" },
  playOverlay: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});
