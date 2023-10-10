import React, { useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "../../types";
import { Text } from "../../src/components/Themed";
import { Checkbox, Button, TextInput } from "react-native-paper";
import { CreateAccount } from "../../middleware/api";

export default function Register({
  navigation,
}: RootStackScreenProps<"Register">) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  function createAccount() {
    if(username.length <= 5 || password.length <= 5) return console.log("invalid password or username");
    CreateAccount(username, password).then((res) => {
      if(res.userExists) {
        console.log("This Username is already used.");
      } else navigation.navigate("Root");
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image
          source={require("../../assets/images/halk.png")}
          style={styles.icon}
        />
      </View>
      <View style={{ margin: 10 }}>
        <Text style={styles.registerLabel}>Register</Text>
        <View style={styles.registerLabelLine}></View>
      </View>
      <View style={styles.inputsContainer}>
        <TextInput
          label="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={styles.input}
          underlineColor={"#b5e3e6"}
        />
        <TextInput
          label="PassWord"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
        />
      </View>
      <View>
        <Checkbox.Item
          label="I accept the terms of use and contract"
          status="checked"
          labelStyle={styles.checkLabel}
          position="leading"
        />
      </View>
      <View style={{ alignItems: "center" }}>
        <Button mode="contained" onPress={() => createAccount()}>
          Create Account!
        </Button>
      </View>
      <View style={styles.singinContainer}>
        <Text style={styles.signinLabel}>Already have a account?</Text>
        <Button mode="text" onPress={() => console.log("Pressed")}>
          Sign In
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: "#191f2d",
  },
  iconContainer: {
    flexDirection: "column",
    alignContent: "flex-end",
  },
  icon: {
    width: 60,
    height: 60,
    alignSelf: "flex-end",
    margin: 10,
  },
  registerLabel: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#e9edf4",
  },
  registerLabelLine: {
    backgroundColor: "#b5e3e6",
    height: 10,
    width: 130,
    borderWidth: 1,
    borderColor: "#b5e3e6",
    borderRadius: 10,
  },
  input: {
    backgroundColor: "#2f3541",
    color: "#fff",
  },
  inputsContainer: {
    margin: 10,
    gap: 10,
    color: "#e9edf4",
  },
  checkLabel: {
    color: "#e9edf4",
  },
  singinContainer: {
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    alignSelf: "center",
  },
  signinLabel: {
    color: "#e9edf4",
  },
});
