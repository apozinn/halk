import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  Fontisto,
} from "@expo/vector-icons";
import { TextInput } from "@/components/themed/Themed";
import { getColors } from "../../constants/Colors";
import { UserContext } from "@/contexts/user";
import { SocketController } from "@/socket/socketController";
import { Chat } from "@/types";
import { t } from "i18next";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import SendMediaMessage from "@/utils/sendMediaMessage";

export default function BottomContent({ chat }: { chat: Chat }) {
  const { user } = useContext(UserContext);
  const [text, setText] = useState("");
  const colors = getColors();

  useEffect(() => {
    if (!chat || !user) return;
    const socketController = SocketController.getInstance({
      url: process.env.EXPO_PUBLIC_API_URL,
      token: user.id,
    });

    socketController.emit("userTyping", {
      room: chat.id,
      typing: text.length === 0 ? false : true,
      userId: user.id,
    });
  }, [text]);

  function sendMessage() {
    if (!chat || !user || !text) return;

    const socketController = SocketController.getInstance({
      url: process.env.EXPO_PUBLIC_API_URL,
      token: user.id,
    });

    socketController.sendMessage({
      chat,
      messageContent: text,
      ImageBase64: undefined,
      localImageUri: undefined,
    });
    
    setText("");
  }

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }

    if (!result.assets || !user?.id) return;

    SendMediaMessage(user, chat, result.assets[0].uri, result.assets[0].type);
  };

  return (
    <View
      style={[
        styles.bottomContainer,
        { backgroundColor: colors.defaultColors.card },
      ]}
    >
      <View style={styles.buttonContentLeft}>
        <TouchableOpacity
          style={{ ...styles.blueButton, backgroundColor: colors.tint }}
          onPress={() => {
            router.navigate("camera/camera");
          }}
        >
          <Fontisto name="camera" size={20} color="white" />
        </TouchableOpacity>
        <TextInput
          style={styles.inputMessage}
          placeholder={t("chat.sendAMessageInputPlaceHolder")}
          value={text}
          onChangeText={(value) => setText(value)}
          onSubmitEditing={() => sendMessage()}
          maxLength={4100}
        />
      </View>
      {text ? (
        <TouchableOpacity
          style={{ ...styles.blueButton, backgroundColor: colors.tint }}
          onPress={() => sendMessage()}
        >
          <FontAwesome name="send" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <View style={styles.othersMedias}>
          <TouchableOpacity onPress={() => pickImage()}>
            <Ionicons name="add-circle-outline" size={26} color={colors.tint} />
          </TouchableOpacity>
          {/* <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => {}}>
            <MaterialIcons
              name="keyboard-voice"
              size={26}
              color={colors.tint}
            />
          </TouchableOpacity> */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(18, 18, 18)",
    justifyContent: "space-between",
    padding: 5,
  },
  button: {
    padding: 5,
  },
  buttonContentLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
  },
  blueButton: {
    padding: 10,
    borderRadius: 50,
  },
  othersMedias: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputMessage: {
    paddingVertical: 8,
    width: "100%",
    marginLeft: 10,
  },
});
