import {} from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function ConfigStatusButton({ navigation }) {
	return (
		<TouchableOpacity style={styles.button} onPress={() => {}}>
			<AntDesign name="setting" size={25} color="white" />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		width: 50,
		height: 50,
		borderRadius: 100,
		backgroundColor: "#2f95dc",
		padding: 10,
		position: "absolute",
		bottom: 10,
		right: 10,
		alignItems: "center",
		justifyContent: "center",
	},
});
