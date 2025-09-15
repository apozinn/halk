import { View, Image, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { RootStackScreenProps } from "@/types";
import { Text } from "../../components/ui/Themed";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.centeredView}>
        <Image source={require("../../assets/images/halk_icon.png")} style={styles.image} />
        <Text style={styles.title}>Welcome to Halk</Text>
        <Text style={styles.description}>
          This is a basic and open source template of a real-time messaging app made in react-native and expo, visit the source code on our github, download and customize it however you want!
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => {
          router.navigate("welcome/signIn");
        }} style={{ ...styles.outlineButton, ...styles.signButton }}>
          <Text style={{ fontSize: 17 }}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          router.navigate("welcome/signUp");
        }} style={{ ...styles.outlineButton, ...styles.loginButton }}>
          <Text style={{ fontSize: 17 }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  skipContainer: {
    alignItems: "flex-end",
  },
  skipButton: {
    marginHorizontal: 10,
    padding: 10
  },
  centeredView: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    marginTop: "20%"
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
    marginVertical: 30,
  },
  image: {
    width: 250,
    height: 250,
  },
  description: {
    fontSize: 15,
    marginHorizontal: "10%"
  },
  button: {
    backgroundColor: "#2f95dc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  ballsContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 5,
    flexDirection: "row",
  },
  ball: {
    width: 10,
    height: 10,
    borderRadius: 100,
    marginRight: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: "5%"
  },
  outlineButton: {
    padding: 10,
    minWidth: 130,
    alignItems: "center",
    borderRadius: 100
  },
  signButton: {
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 1
  },
  loginButton: {
    backgroundColor: "#19dcdc"
  }
});
