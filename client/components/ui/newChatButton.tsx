import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getColors } from "../../constants/Colors";

export default function NewChatButton() {
  const navigation = useRouter();
const colors = getColors();

  return (
    <Pressable
      style={[styles.container, { backgroundColor: colors.tint}]}
      onPress={() => navigation.navigate("/chat/newChat")}
    >
      <Entypo name="chat" size={30} color="white" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 65,
    height: 65,
    borderRadius: 100,
    padding: 10,
    position: "absolute",
    bottom: "2%",
    right: "2%",
    alignItems: "center",
    justifyContent: "center",
  },
});
