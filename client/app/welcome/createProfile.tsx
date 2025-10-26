import { useState, useContext, useCallback } from "react";
import { Image, Pressable, StatusBar, StyleSheet, View, Alert } from "react-native";
import { Text, TextInput } from "../../components/ui/Themed";
import * as ImagePicker from "expo-image-picker";
import { createProfile } from "../../middleware/api";
import { UserContext } from "@/contexts/user";
import { useRouter } from "expo-router";
import { t } from "i18next";
import { ThemedSafeAreaView } from "@/components/themedSafeAreaView";
import { ThemedView } from "@/components/ThemedView";

export default function CreateProfile() {
  const router = useRouter();
  const { user, updateUser } = useContext(UserContext);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const pickAndUploadImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (result.canceled) return;

      const { uri } = result.assets[0];
      setAvatar(uri);
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "image/jpeg",
        name: "avatar.jpg",
      } as any);

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      if (data.success) {
        setAvatar(data.url);
      } else {
        Alert.alert(t("errorUploadingImage"));
        setAvatar("");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      Alert.alert(t("errorUploadingImage"));
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleCreateProfile = useCallback(async () => {
    if (isUploading) {
      return Alert.alert(t("waitAvatarUpload"));
    }

    if (!name.trim() || !username.trim()) {
      return Alert.alert(t("fillRequiredFields"));
    }

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

    try {
      const data = await createProfile(newUser);

      if (!data.created) {
        return Alert.alert(t(data.reason));
      }

      updateUser({
        logged: true,
        user: newUser,
      });

      router.navigate("/");
    } catch (error) {
      console.error("Create profile failed:", error);
      Alert.alert(t("unexpectedError"));
    }
  }, [name, username, avatar, bio, isUploading, user]);

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <Text style={styles.title}>{t("createProfileTitle")}</Text>

        <View style={styles.primaryDiv}>
          <Pressable style={styles.iconContainer} onPress={pickAndUploadImage}>
            <Image
              source={avatar ? { uri: avatar } : require("@/assets/images/userIcon.png")}
              style={styles.userIcon}
            />
            <Text style={styles.avatarHint}>
              {isUploading ? t("uploading") : t("chooseAvatar")}
            </Text>
          </Pressable>

          <View style={styles.inputsContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>{t("name")}</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder={t("enterName")}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>{t("username")}</Text>
              <TextInput
                style={styles.textInput}
                value={username}
                onChangeText={setUsername}
                placeholder={t("enterUsername")}
              />
            </View>
          </View>
        </View>

        <View style={styles.secondaryDiv}>
          <Text style={styles.inputTitle}>{t("bio")}</Text>
          <TextInput
            style={styles.bioInput}
            value={bio}
            onChangeText={setBio}
            placeholder={t("writeBio")}
            multiline
          />
        </View>
      </ThemedView>

      <ThemedView style={styles.footer}>
        <Pressable style={styles.nextButton} onPress={handleCreateProfile}>
          <Text style={styles.nextButtonText}>{t("continue")}</Text>
        </Pressable>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    fontSize: 18,
  },
  primaryDiv: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
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
  avatarHint: {
    fontSize: 10,
    opacity: 0.7,
  },
  inputsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputTitle: {
    fontSize: 12,
    marginBottom: 3,
  },
  textInput: {
    borderBottomColor: "#222",
    borderBottomWidth: 1,
    paddingVertical: 3,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 10,
    marginTop: 5,
    height: 70,
    padding: 8,
    textAlignVertical: "top",
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  nextButton: {
    backgroundColor: "#2f95dc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
