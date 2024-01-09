import React, { useContext, useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet, Alert, Pressable, TouchableOpacity } from "react-native";
import { RootStackScreenProps } from "../../types";
import { Text, View } from "../../src/components/Themed";
import { TextInput, Button } from "react-native-paper";
import { CreateAccount, Login } from "../../middleware/api";
import { getColors } from "../../constants/Colors";
import { UserContext } from "../../src/contexts/user";

export default function Register({
  navigation,
}: RootStackScreenProps<"Register">) {
  navigation.navigate("CreateProfile");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const { user, updateUser } = useContext(UserContext);
  const colors = getColors();

  function verifyLength() {
    if (username.length <= 3) {
      Alert.alert(
        'Invalid username',
        'The username must have at least 4 characters',
        [
          { text: 'Ok' },
        ],
        { cancelable: true }
      );
      return false;
    }
    if (password.length <= 5) {
      Alert.alert(
        'Invalid password',
        'The password must have at least 5 characters',
        [
          { text: 'Ok' },
        ],
        { cancelable: true }
      );
      return false;
    }
    return true;
  }

  function createAccount() {
    if (!verifyLength()) return;
    CreateAccount(username, password).then((res) => {
      if (res.userAlreadyExists) {
        Alert.alert(
          'Invalid username',
          'This username is already used',
          [
            { text: 'Ok' },
          ],
          { cancelable: true }
        );
      } else {
        updateUser({
          logged: true,
          id: res.user.id,
          ...user,
        });
        navigation.navigate("CreateProfile");
      }
    });
  }

  function login() {
    if (!verifyLength()) return;
    Login(username, password).then((res) => {
      if (!res.logged) {
        Alert.alert(
          "",
          res.reason,
          [
            { text: 'Ok' },
          ],
          { cancelable: true }
        );
      } else {
        updateUser({
          logged: true,
          user: {
            id: res.user.id,
            profile: { ...res.user.profile},
          },
        });
        console.log("after", user);
        navigation.navigate("Root");
      }
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
        {isNewUser ? (
          <Text style={styles.registerLabel}>Register</Text>
        ) : (
          <Text style={styles.registerLabel}>Login</Text>
        )}
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
      <View style={{
        alignContent: "center",
        alignItems: "center"
      }}>
        <TouchableOpacity onPress={() => { setIsNewUser(!isNewUser) }}>
          {isNewUser ? (
            <Text>I already have a account</Text>
          ) : (
            <Text>I don't have a account</Text>
          )}

        </TouchableOpacity>
      </View>
      <View style={styles.bottomButton}>
        {isNewUser ? (
          <Button labelStyle={{ color: colors.appColor }} mode="outlined" onPress={() => createAccount()} style={styles.signButton}>
            Create Account
          </Button>
        ) : (
          <Button labelStyle={{ color: colors.appColor }} mode="outlined" onPress={() => login()} style={styles.signButton}>
            Login
          </Button>
        )}
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
  bottomButton: {
    flex: 1,
    alignContent: "flex-end",
    alignItems: "flex-end",
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 30,
  },
  signButton: {
    borderRadius: 20,
    color: 'red'
  },
});
