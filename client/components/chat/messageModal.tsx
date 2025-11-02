import React, { useCallback, useContext, useState } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { Text } from "../themed/Themed";
import Modal from "react-native-modal";
import { Message } from "@/types";
import { t } from "i18next";
import { getColors } from "@/constants/Colors";
import { UserContext } from "@/contexts/user";

export default function MessageModal({
  messageModal,
  setMessageModal,
}: {
  messageModal: Message | undefined;
  setMessageModal: (message: Message | undefined) => void;
}) {
  const [scrollOffset, setScrollOffset] = useState<number | null>(null);
  const colors = getColors();
  const { user } = useContext(UserContext);

  const close = useCallback(() => setMessageModal(undefined), []);
  const isVisible = useCallback(() => !!messageModal, [messageModal]);
  const handleOnScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) =>
      setScrollOffset(e.nativeEvent.contentOffset.y),
    []
  );

  if (!messageModal || !user) return null;

  return (
    <Modal
      isVisible={isVisible()}
      onSwipeComplete={close}
      swipeDirection={["down"]}
      scrollOffset={scrollOffset || 0}
      scrollOffsetMax={100}
      propagateSwipe
      style={styles.modal}
      backdropTransitionOutTiming={0}
      useNativeDriverForBackdrop
      useNativeDriver
      avoidKeyboard={false}
    >
      <View style={styles.modalContainer}>
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
              <Text style={{ fontWeight: "bold" }}>{messageModal.content}</Text>
            </View>

            <View style={styles.modalLinks}>
              <TouchableOpacity style={styles.modalLink}>
                <Entypo name="reply" size={26} color={colors.tint} />
                <Text style={styles.modalLinkText}>{t("message.reply")}</Text>
              </TouchableOpacity>

              {messageModal.authorId === user.id && (
                <TouchableOpacity style={styles.modalLink}>
                  <MaterialIcons name="delete" size={26} color={colors.tint} />
                  <Text style={styles.modalLinkText}>
                    {t("delete_message")}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.modalLink}>
                <MaterialIcons name="push-pin" size={26} color={colors.tint} />
                <Text style={styles.modalLinkText}>{t("message.pin_message")}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalLink}>
                <Entypo name="link" size={26} color={colors.tint} />
                <Text style={styles.modalLinkText}>{t("message.share")}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalLink}>
                <MaterialIcons
                  name="emoji-emotions"
                  size={26}
                  color={colors.tint}
                />
                <Text style={styles.modalLinkText}>{t("message.react")}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalLink}>
                <Ionicons name="copy" size={26} color={colors.tint} />
                <Text style={styles.modalLinkText}>{t("message.copy")}</Text>
              </TouchableOpacity>

              {messageModal.authorId !== user.id && (
                <TouchableOpacity style={styles.modalLink}>
                  <MaterialIcons name="report" size={26} color={colors.tint} />
                  <Text style={styles.modalLinkText}>{t("message.report")}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    alignItems: "center",
    margin: 0,
    padding: 0,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "50%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  modalContent: {
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
