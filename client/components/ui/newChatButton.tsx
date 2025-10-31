import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function NewChatButton() {
  const navigation = useRouter();

  return (
    <Pressable
      style={{ ...styles.container }}
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
    backgroundColor: "#19dcdc",
    padding: 10,
    position: "absolute",
    bottom: "2%",
    right: "2%",
    alignItems: "center",
    justifyContent: "center",
  },
});
