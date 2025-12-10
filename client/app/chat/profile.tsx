import { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { getColors } from "../../constants/Colors";
import {
  AntDesign,
  Ionicons,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";
import { Text } from "../../components/themed/Themed";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { User } from "@/types";
import { ThemedSafeAreaView } from "@/components/themed/themedSafeAreaView";
import { ChatsContext } from "@/contexts/chats";

export default function Profile() {
  const { chats } = useContext(ChatsContext);
  const [user, setUser] = useState<User>({} as User);

  const { chatId } = useLocalSearchParams();

  const colors = getColors();
  const navigation = useRouter();

  const { t } = useTranslation();

  useEffect(() => {
    if (!chatId) return;

    let thisChat = chats.filter((c) => c.id === chatId)[0];
    if (thisChat) {
      setUser(thisChat.user);
    }
  }, [chatId]);

  return user?.id && (
    <ThemedSafeAreaView>
      <ScrollView style={styles.container}>
        <ImageBackground
          source={
            user.profile.avatar
              ? { uri: user.profile.avatar }
              : require("../../assets/images/userIcon.png")
          }
          resizeMode="cover"
          style={styles.topContainer}
        >
          <View style={styles.topContainerIcons}>
            <TouchableOpacity onPress={() => navigation.back()}>
              <AntDesign name="arrow-left" size={26} color={colors.icon} />
            </TouchableOpacity>
            <View style={styles.iconGroup}>
              <TouchableOpacity>
                <Ionicons name="call" size={26} color={colors.icon} />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginHorizontal: 10 }}>
                <FontAwesome name="video-camera" size={26} color={colors.icon} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Feather name="more-vertical" size={26} color={colors.icon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.topContainerInfo}>
            <Text style={styles.userName}>{user.profile.name}</Text>
            <Text style={styles.userUsername}>@{user.profile.username}</Text>
          </View>
        </ImageBackground>

        <View style={styles.userInfoContainer}>

          <View style={styles.userInfoContainerSection}>
            <Text style={styles.userInfoContainerUpper}>
              {user.profile.bio || t("profile.noBio")}
            </Text>
            <Text style={styles.userInfoContainerLower}>{t("profile.bio")}</Text>
          </View>

          <View style={styles.userInfoContainerSection}>
            <Text style={styles.userInfoContainerUpper}>
              @{user.profile.username}
            </Text>
            <Text style={styles.userInfoContainerLower}>
              {t("profile.username")}
            </Text>
          </View>
        </View>

      </ScrollView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    height: 350,
    padding: 10,
    justifyContent: "space-between",
  },
  topContainerIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  topContainerInfo: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  userUsername: {
    color: "white",
    fontSize: 16,
  },
  userInfoContainer: {
    padding: 10,
  },
  mediaContainer: {
    padding: 10,
  },
  containerTitle: {
    fontWeight: "bold",
    color: "#2f95dc",
    fontSize: 16,
    marginBottom: 5,
  },
  userInfoContainerUpper: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userInfoContainerLower: {
    fontSize: 13,
  },
  userInfoContainerSection: {
    paddingVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
