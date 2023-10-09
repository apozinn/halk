import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";

export default function NewChat({ navigation }) {
  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate("NewChat")}
    >
      <Entypo name="chat" size={25} color="white" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: "#2f95dc",
    padding: 10,
    position: "absolute",
    bottom: 10,
    right: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
