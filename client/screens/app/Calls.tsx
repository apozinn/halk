import { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  SectionList,
} from "react-native";
import { RootTabScreenProps } from "../../types";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, TextInput } from "../../src/components/Themed";
import { UserContext } from "../../src/contexts/user";
import { ChatsContext } from "../../src/contexts/chats";
import { Userpic } from "react-native-userpic";
import { getColors } from "../../constants/Colors";

export default function Calls({ navigation }: RootTabScreenProps<"Calls">) {
  const { user } = useContext(UserContext);
  const { chats } = useContext(ChatsContext);
  const [calls, setCalls] = useState([]);

  const colors = getColors();

  useEffect(() => {
    if (!calls.length) {
      setCalls((current) => [
        ...current,
        {
          title: "Chamadas recentes",
          data: [{ props: null }],
        },
      ]);
    }
  }, []);

  function CallContainer({ call }) {
    if (call.props === null) {
      return <></>
    } else {
      return <></>;
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.newCall} onPress={() => {}}>
        <View style={styles.newCallButton}>
          <MaterialIcons name="add-ic-call" size={27} color="white" />
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Inicie uma nova chamada</Text>
          <Text style={{ fontSize: 12 }}>
            Toque para iniciar uma chamada com outro usuário
          </Text>
        </View>
      </TouchableOpacity>

      <SectionList
        sections={calls}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <CallContainer call={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionTitle}>{title}</Text>
        )}
        style={{ marginHorizontal: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  newCall: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  newCallButton: {
    backgroundColor: "#2f95dc",
    borderRadius: 100,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  sectionTitle: {
    fontSize: 13,
    opacity: 0.8,
  },
});
