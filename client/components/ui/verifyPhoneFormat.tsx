import React, { useState, useContext } from "react";
import { View, Modal, Pressable, StyleSheet } from "react-native";
import { Text } from "./Themed";
import { isPossiblePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import { sendSms } from "../../middleware/api";
import { UserContext } from "@/contexts/user";
import { useRouter } from "expo-router";


export default function VerifyPhoneFormat({ phone }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useRouter();
  const { user, logged, updateUser } = useContext(UserContext);
  function Verify() {
    if (!phone || !navigation) return null;

    if (isPossiblePhoneNumber(phone) && isValidPhoneNumber(phone)) {
      return (
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Você confirma {phone} como seu número?
                </Text>
                <View style={styles.buttonsContainer}>
                  <Pressable onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={[styles.button, { color: "red" }]}>
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setModalVisible(!modalVisible);

                      updateUser({
                        logged: logged,
                        user: {
                          id: '97839283983982938928392',
                          phone,
                          profile: user.profile,
                        },
                      });
                      navigation.navigate("CreateProfile");
                      return;
                      sendSms(phone.split(" ").join("")).then((data) => {
                        if (data.codeSend) {
                          updateUser({
                            logged: logged,
                            user: {
                              id: data.id,
                              phone,
                              profile: user.profile,
                            },
                          });
                          navigation.navigate("ReceiveCode");
                        } else
                          alert(
                            "Não foi possivel enviar o codigo para o seu numero"
                          );
                      });
                    }}
                  >
                    <Text style={[styles.button, { color: "lime" }]}>
                      Confirmar
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      );
    } else {
      return (
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Número invalído, tente novamente.
                </Text>
                <View style={styles.buttonsContainer}>
                  <Pressable onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={[styles.button, { color: "lime" }]}>Ok</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      );
    }
  }

  return (
    <>
      <Pressable
        style={[styles.nextButton, { opacity: !phone ? 0.5 : 1 }]}
        onPress={() => setModalVisible(modalVisible ? false : true)}
      >
        <Text>Continue</Text>
      </Pressable>
      <Verify />
    </>
  );
}

const styles = StyleSheet.create({
  nextButton: {
    backgroundColor: "#2f95dc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: "absolute",
    borderRadius: 100,
    bottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "#222",
    borderWidth: 1,
  },
  title: {
    fontSize: 14,
  },
  button: {
    fontSize: 12,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
});
