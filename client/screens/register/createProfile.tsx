import { useState, useContext, useEffect } from "react";
import { Image, Pressable, StatusBar, StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "../../types";
import { Text, TextInput } from "../../src/components/Themed";
import * as ImagePicker from "expo-image-picker";
import { createProfile, verifyUsername } from "../../middleware/api";
import { UserContext } from "../../src/contexts/user";

export default function CreateProfile({
  navigation,
}: RootStackScreenProps<"CreateProfile">) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [existsUsername, setExistsUsername] = useState(false);

  const { user, logged, updateUser } = useContext(UserContext);

  function Create() {
    const newUser = {
      id: user.id,
      phone: user.phone,
      profile: {
        name,
        username,
        avatar,
        bio,
      },
    };

    createProfile(newUser).then((data) => {
      if (data.err)
        return alert("houve um erro ao criar o seu perfil, tente novamente");

      if (data.created) {
        updateUser({
          logged: true,
          user: newUser,
        });
        navigation.navigate("Root");
      }
    });
  }

  useEffect(() => {
    if (username)
      verifyUsername(username).then((data) => setExistsUsername(data.exists));
  }, [username]);

  async function SelectIcon() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setAvatar(result.uri);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your profile</Text>
      <View style={styles.primaryDiv}>
        <Pressable style={styles.iconContainer} onPress={() => SelectIcon()}>
          <Image
            source={
              avatar ? avatar : require("../../assets/images/userIcon.png")
            }
            style={styles.userIcon}
          />
          <Text style={{ fontSize: 10 }}>Choose a icon</Text>
        </Pressable>
        <View style={styles.inputsContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Name</Text>
            <TextInput
              style={styles.nameInput}
              onChangeText={(value) => setName(value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Username</Text>
            <TextInput
              style={styles.nameInput}
              onChangeText={(value) => setUsername(value)}
            />
            {existsUsername ? (
              <Text style={styles.existsUsername}>
                Este username já esta sendo usado
              </Text>
            ) : (
              <></>
            )}
          </View>
        </View>
      </View>
      <View style={styles.secondaryDiv}>
        <Text style={styles.inputTitle}>Bio</Text>
        <TextInput
          style={styles.bioInput}
          onChangeText={(value) => setBio(value)}
        />
      </View>
      <Pressable style={styles.nextButton} onPress={() => Create()}>
        <Text style={{ color: "white" }}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  primaryDiv: {
    flexDirection: "row",
    alignItems: "center",
  },
  secondaryDiv: {
    margin: 10,
  },
  userIcon: {
    width: 100,
    height: 100,
    marginBottom: 5,
    borderRadius: 100,
  },
  iconContainer: {
    margin: 10,
    alignItems: "center",
  },
  inputsContainer: {},
  inputContainer: {},
  inputTitle: {
    fontSize: 10,
  },
  nameInput: {
    borderBottomColor: "#222",
    borderBottomWidth: 1,
    paddingVertical: 3,
    marginBottom: 10,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 10,
    marginTop: 5,
    height: 70,
  },
  nextButton: {
    backgroundColor: "#2f95dc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    position: "absolute",
    bottom: 10,
    left: "40%",
  },
  existsUsername: {
    fontSize: 11,
    color: "red",
  },
});
