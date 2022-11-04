import { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text, TextInput } from "../../src/components/Themed";
import { UserContext } from "../../src/contexts/user";
import { Userpic } from "react-native-userpic";
import {
  FontAwesome,
  AntDesign,
  MaterialIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";
import { getColors } from "../../constants/Colors";
import { BufferContext } from "../../src/contexts/buffer";
import { SettingsContext } from "../../src/contexts/settings";
import Tools from "../../src/utils/tools";
import { postStatus } from '../../middleware/api';

export default function StatusCreateText({ navigation }) {
  const { user } = useContext(UserContext);
  const { statusBuffer, updateBuffer } = useContext(BufferContext);
  const { statusSettings, updateSettings } = useContext(SettingsContext);
  const [statusColor, setStatusColor] = useState(
    new Tools().generateRandomColor()
  );
  const [text, setText] = useState("");
  const [privacity, setPrivacity] = useState(statusSettings.privacity);
  const [duration, setDuration] = useState(statusSettings.duration);
  const colors = getColors();

  function postStts() {
    const _stts = {
      id: new Tools().generateRandomId(),
      createdAt: new Date().getTime(),
      type: "text",
      content: text,
      color: statusColor,
    };

    postStatus(user, _stts).then((data) => {
      if(data.post) {
        statusBuffer.posted.push(_stts);
        updateBuffer({ statusBuffer });
        return navigation.navigate("Root");
      } else {
        alert("Houve um erro ao postar o seu status.");
      }
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: statusColor }]}>
      <View style={[styles.rowContainer, { justifyContent: "space-between" }]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Feather name="more-vertical" size={28} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.centerContainer}>
        <TextInput
          placeholder="Digite seu status"
          onChangeText={(value) => setText(value)}
          style={styles.input}
          onSubmitEditing={() => postStts()}
          maxLength={2000}
          autoFocus={true}
          multiline={true}
          numberOfLines={10}
        />
      </View>
      <View style={styles.rowContainer}>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <MaterialIcons name="visibility" size={27} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { marginHorizontal: 10 }]}
          onPress={() => {}}
        >
          <AntDesign name="clockcircleo" size={27} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setStatusColor(Tools.generateRandomColor())}
        >
          <FontAwesome5 name="palette" size={27} color="white" />
        </TouchableOpacity>
      </View>
      {!text.length ? (
        <></>
      ) : (
        <TouchableOpacity style={styles.postButton} onPress={() => postStts()}>
          <FontAwesome name="send" size={27} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  rowContainer: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    borderWidth: 0,
    borderColor: "none",
    textAlign: "center",
  },
  button: {
    padding: 5,
  },
  postButton: {
    position: "absolute",
    width: 60,
    height: 60,
    backgroundColor: "#2f95dc",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    bottom: 20,
    right: 20,
  },
});
