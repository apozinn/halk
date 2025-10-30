import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { searchUser } from "../../middleware/api";
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
import { ThemedView } from "@/components/themed/ThemedView";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams(); 
  const colors = getColors();
  const navigation = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchUser() {
      if (!id) {
        navigation.back();
        return;
      }

      try {
        const data = await searchUser("", id.toString());
        if (data && data.length > 0) setUser(data[0]);
        else navigation.back();
      } catch (error) {
        navigation.back();
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  if (!user) return <></>;

  return (
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
            <AntDesign name="arrowleft" size={26} color="white" />
          </TouchableOpacity>
          <View style={styles.iconGroup}>
            <TouchableOpacity>
              <Ionicons name="call" size={26} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginHorizontal: 10 }}>
              <FontAwesome name="video-camera" size={26} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="more-vertical" size={26} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.topContainerInfo}>
          <Text style={styles.userName}>{user.profile.name}</Text>
          <Text style={styles.userUsername}>@{user.profile.username}</Text>
        </View>
      </ImageBackground>

      <View style={styles.userInfoContainer}>
        <Text style={styles.containerTitle}>{t("profile.info")}</Text>

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

        <View style={styles.userInfoContainerSection}>
          <Text style={styles.userInfoContainerUpper}>
            {t("profile.notificationsEnabled")}
          </Text>
          <Text style={styles.userInfoContainerLower}>
            {t("profile.notifications")}
          </Text>
        </View>
      </View>

      <View style={styles.mediaContainer}>
        <Text style={styles.containerTitle}>{t("profile.sharedMedia")}</Text>
      </View>
    </ScrollView>
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
    opacity: 0.7,
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
