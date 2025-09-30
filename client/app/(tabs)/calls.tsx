import { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SectionList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, TextInput } from "../../components/ui/Themed";
import { UserContext } from "@/contexts/user";
import { ChatsContext } from "@/contexts/chats";
import { getColors } from "../../constants/Colors";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";

export default function Calls() {
  const { user } = useContext(UserContext);
  const { chats } = useContext(ChatsContext);
  const [calls, setCalls] = useState([]);
  const navigation = useRouter();
  const insets = useSafeAreaInsets();
  
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
    <ThemedView style={{...styles.container, marginTop: insets.top}}>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
