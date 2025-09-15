import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { RootStackScreenProps } from "@/types";
import { searchUser } from "../../middleware/api";
import { getColors } from "../../constants/Colors";
import {
  AntDesign,
  Ionicons,
  Feather,
  FontAwesome,
  MaterialIcons,
  Fontisto,
} from "@expo/vector-icons";
import { Text } from "../../components/ui/Themed";
import { useRouter } from "expo-router";

export default function Profile() {
  const [user, setUser] = useState();
  const colors = getColors();
  const navigation = useRouter();
  const route = { params: { id: "" } }; // Placeholder for route params

  useEffect(() => {
    const userId = route.params.id;
    if (userId) {
      searchUser(userId).then((data) => {
        if (data[0]) {
          setUser(data[0]);
        } else navigation.goBack();
      });
    } else navigation.goBack();
  }, []);

  return (
    <>
      {!user ? (
        <></>
      ) : (
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
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={26} color="white" />
              </TouchableOpacity>
              <View style={styles.topContainerIcons}>
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
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
              >
                {user.profile.name}
              </Text>
              <Text style={{ color: "white", fontSize: 18 }}>
                {user.profile.username}
              </Text>
            </View>
          </ImageBackground>

          <View style={styles.userInfoContainer}>
            <Text style={styles.containerTitle}>Info</Text>

            <View style={styles.userInfoContainerSection}>
              <Text style={styles.userInfoContainerUpper}>
                {user.profile.bio}
              </Text>
              <Text style={styles.userInfoContainerLower}>Bio</Text>
            </View>
            <View style={styles.userInfoContainerSection}>
              <Text style={styles.userInfoContainerUpper}>
                @{user.profile.username}
              </Text>
              <Text style={styles.userInfoContainerLower}>Nome de usuário</Text>
            </View>
            <View style={styles.userInfoContainerSection}>
              <Text style={styles.userInfoContainerUpper}>Notificaçãoes</Text>
              <Text style={styles.userInfoContainerLower}>Ativadas</Text>
            </View>
          </View>

          <View style={styles.mediaContainer}>
            <Text style={styles.containerTitle}>Mídias compartilhadas</Text>
          </View>
        </ScrollView>
      )}
    </>
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
  userInfoContainer: {
    padding: 10,
  },
  mediaContainer: {
    padding: 10,
  },
  containerTitle: {
    fontWeight: "bold",
    color: "#2f95dc",
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
});
