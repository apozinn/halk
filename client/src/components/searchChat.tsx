import { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Modal, Platform } from "react-native";
import { TextInput, Text } from "./Themed";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { getColors } from "../../constants/Colors";

export default function SearchChat({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const colors = getColors();

  function ShowModal() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.defaultColors.card,
                borderBottomWidth: 1,
                borderBottomColor: colors.defaultColors.border,
              },
            ]}
          >
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <AntDesign name="arrowleft" size={25} color={colors.tint} />
              </TouchableOpacity>
              <TextInput
                placeholder="Pesquisar"
                style={[styles.input, { backgroundColor: "blue" }]}
              />
            </View>
            <TouchableOpacity onPress={() => {}}>
              <MaterialCommunityIcons
                name="filter-variant"
                size={24}
                color={colors.tint}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(modalVisible ? false : true)}
        style={{
          marginRight: 5,
        }}
      >
        <AntDesign name="search1" size={22} color={colors.tint} />
      </TouchableOpacity>
      <ShowModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  inputContainer: {
    height: Platform.OS === 'android' || Platform.OS === "ios" ? 43 : 40,
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 10,
    width: "85%",
  },
});
