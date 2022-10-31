import { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { RootTabScreenProps } from "../../types";
import { Text, TextInput } from "../../src/components/Themed";
import { UserContext } from "../../src/contexts/user";
import { ChatsContext } from "../../src/contexts/chats";
import { Userpic } from "react-native-userpic";
import { FontAwesome, Entypo, EvilIcons, Ionicons } from "@expo/vector-icons";
import { getColors } from "../../constants/Colors";
import ConfigStatusButton from "../../src/components/configStatusButton";
import StatusPic from "../../src/components/statusPic";

const badgeProps = {
  size: 50,
  borderRadius: 50,
  animate: true,
};

export default function Status({ navigation }: RootTabScreenProps<"Status">) {
  const { user } = useContext(UserContext);
  const { chats } = useContext(ChatsContext);
  const [status, setStatus] = useState([]);
  const colors = getColors();

  useEffect(() => {
    if (!status.length) {
      setStatus((current) => [
        ...current,
        {
          author: {
            profile: {
              name: "Halk",
              avatar: "",
            },
          },
          stories: [
            [1, 0],
          ],
        },
      ]);
    }

    // <Ionicons name="add-outline" size={24} color="black" />
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <TouchableOpacity
          style={styles.rowContainer}
          onPress={() => console.log("open camera")}
        >
          <Userpic
            size={50}
            name={user.profile.name}
            source={{ uri: user.profile.avatar }}
            colorize={true}
            borderRadius="50%"
            badge={true}
            badgeColor={"#2f95dc"}
            badgePosition={"bottom-right"}
            badgeProps={badgeProps}
            style={{ marginRight: 10 }}
          />
          <View>
            <Text style={{ fontWeight: "bold" }}>Meu status</Text>
            <Text style={{ fontSize: 13 }}>
              Toque para atualizar seu status
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={styles.blueButton}
            onPress={() => console.log("open camera two")}
          >
            <Entypo name="camera" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.blueButton}
            onPress={() => console.log("open text")}
          >
            <FontAwesome name="pencil" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[
          styles.searchContainer,
          { borderBottomColor: colors.defaultColors.border },
        ]}
      >
        <TextInput
          placeholder="Pesquisar"
          style={[
            styles.searchInput,
            { backgroundColor: colors.defaultColors.card },
          ]}
        />
      </View>

      <ScrollView style={styles.statusContainer}>
        {status.map((stts, index) => (
          <TouchableOpacity
            style={styles.statusBlock}
            key={index}
            onPress={() => console.log(stts)}
          >
            <StatusPic
              key={index}
              {...{ stts, navigation, stories: stts.stories }}
            />
            <View style={{ marginLeft: 15 }}>
              <Text style={{ fontWeight: "bold" }}>
                {stts.author.profile.name}
              </Text>
              <Text style={{ fontSize: 12 }}>agora mesmo</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ConfigStatusButton {...{navigation}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    margin: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusContainer: {
    padding: 10,
    marginTop: 5,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  blueButton: {
    ṕadding: 10,
    borderRadius: 100,
    backgroundColor: "#2f95dc",
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  searchContainer: {
    borderBottomWidth: 1,
    padding: 10,
    margintop: 10,
  },
  searchInput: {
    borderRadius: 10,
    width: "100%",
    height: 30,
    padding: 10,
  },
  statusBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
});
