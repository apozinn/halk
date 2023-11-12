import React, { useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet, Pressable } from "react-native";
import { RootStackScreenProps } from "../../types";
import { Text, View, useThemeColor } from "../../src/components/Themed";
import { Checkbox, TextInput } from "react-native-paper";
import { CreateAccount } from "../../middleware/api";
import { getColors } from "../../constants/Colors";

export default function Register({
  navigation,
}: RootStackScreenProps<"Register">) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const colors = getColors();

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
          style={{
            backgroundColor: colors.secondary,
          }}
          underlineColor={colors.appColor}
          activeUnderlineColor={colors.appColor}
        />
        <TextInput
          label="PassWord"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={{
            backgroundColor: colors.secondary,
          }}
          underlineColor={colors.appColor}
          activeUnderlineColor={colors.appColor}
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
        <Pressable>
          <Text>Create Account</Text>
        </Pressable>
      </View>
      <View style={styles.singinContainer}>
        <Text style={styles.signinLabel}>Already have a account?</Text>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
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
  },
  registerLabelLine: {
    backgroundColor: "#00B0FF",
    height: 10,
    width: 130,
    borderWidth: 1,
    borderColor: "#00B0FF",
    borderRadius: 10,
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
