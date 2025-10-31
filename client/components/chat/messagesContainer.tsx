import React, { useState, useRef, useCallback } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { Text } from "../themed/Themed";
import Modal from "react-native-modal";
import { Avatar } from "@kolking/react-native-avatar";
import { Chat, Message, User } from "@/types";
import { useTranslation } from "react-i18next";

interface MessagesContainerProps {
  user: User;
  chat: Chat;
  colors: any;
}

export default function MessagesContainer({
  user,
  chat,
  colors,
}: MessagesContainerProps) {
  const { t } = useTranslation("messages");
  const scrollViewRef = useRef<ScrollView>(null);

  const [visible, setVisible] = useState(false);
  const [scrollOffset, setScrollOffset] = useState<number | null>(null);
  const [messageModal, setMessageModal] = useState<any>(null);
  const [messageModalContent, setMessageModalContent] = useState<string>("");

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);
  const isVisible = useCallback(() => visible, [visible]);

  const handleOnScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setScrollOffset(event.nativeEvent.contentOffset.y);
    },
    []
  );

  const handleScrollTo = useCallback((p: any) => {
    scrollViewRef.current?.scrollTo(p);
  }, []);

  const renderModalMessage = useCallback(() => {
    if (!messageModal) return null;

    return (
      <Modal
        testID="ModalMessage"
        isVisible={isVisible()}
        onSwipeComplete={close}
        swipeDirection={["down"]}
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset || 0}
        scrollOffsetMax={100}
        propagateSwipe={true}
        style={styles.modal}
      >
        <View style={styles.scrollableModal}>
          <ScrollView onScroll={handleOnScroll} scrollEventThrottle={16}>
            <View style={styles.modalBarContainer}>
              <View style={styles.modalBar} />
            </View>

            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor:
                    colors.theme === "dark"
                      ? colors.defaultColors.card
                      : colors.defaultColors.background,
                },
              ]}
            >
              <View
                style={[
                  styles.modalTopProfile,
                  { backgroundColor: colors.background },
                ]}
              >
                <Avatar
                  size={40}
                  name={messageModal.author.profile.name}
                  colorize
                  radius={50}
                  style={{ marginRight: 10 }}
                />
                <Text style={{ fontWeight: "bold" }}>
                  {messageModalContent}
                </Text>
              </View>

              <View style={styles.modalLinks}>
                <TouchableOpacity style={styles.modalLink}>
                  <Entypo name="reply" size={26} color={colors.tint} />
                  <Text style={styles.modalLinkText}>{t("reply")}</Text>
                </TouchableOpacity>

                {messageModal.author.id === user.id && (
                  <TouchableOpacity style={styles.modalLink}>
                    <MaterialIcons name="delete" size={26} color={colors.tint} />
                    <Text style={styles.modalLinkText}>
                      {t("delete_message")}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.modalLink}>
                  <MaterialIcons name="push-pin" size={26} color={colors.tint} />
                  <Text style={styles.modalLinkText}>{t("pin_message")}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalLink}>
                  <Entypo name="link" size={26} color={colors.tint} />
                  <Text style={styles.modalLinkText}>{t("share")}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalLink}>
                  <MaterialIcons
                    name="emoji-emotions"
                    size={26}
                    color={colors.tint}
                  />
                  <Text style={styles.modalLinkText}>{t("react")}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalLink}>
                  <Ionicons name="copy" size={26} color={colors.tint} />
                  <Text style={styles.modalLinkText}>{t("copy")}</Text>
                </TouchableOpacity>

                {messageModal.author.id !== user.id && (
                  <TouchableOpacity style={styles.modalLink}>
                    <MaterialIcons name="report" size={26} color={colors.tint} />
                    <Text style={styles.modalLinkText}>{t("report")}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }, [
    messageModal,
    messageModalContent,
    colors,
    user,
    scrollOffset,
    handleOnScroll,
    handleScrollTo,
    close,
    isVisible,
    t,
  ]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={[styles.messageContainer, { backgroundColor: colors.messagesContainer }]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      {renderModalMessage()}
      {chat?.messages?.map((message: Message, index: number) => {
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
            key={index}
            style={[
              itsMyMessage ? styles.myMessage : styles.otherMessage,
              index === 0 ? { marginTop: 10 } : {},
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
                onLongPress={() => {
                  setMessageModal(message);
                  setMessageModalContent(message.content);
                  open();
                }}
              >
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
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    paddingHorizontal: 5,
    flexDirection: "column-reverse",
    paddingBottom: 15,
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
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  scrollableModal: {
    minHeight: 400,
  },
  modalContent: {
    height: 400,
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTopProfile: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 50,
  },
  modalLinks: {},
  modalLink: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  modalLinkText: {
    marginLeft: 10,
    fontSize: 17,
  },
  modalBarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalBar: {
    backgroundColor: "#fff",
    width: 60,
    height: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
});
