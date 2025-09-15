import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function NewChat() { 
  const navigation = useRouter();
  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate("newChat")}
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
    backgroundColor: "#2f95dc",
    padding: 10,
    position: "absolute",
    bottom: 30,
    right: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
