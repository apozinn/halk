import {} from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { Text } from "../components/Themed";

export default function ChatTour() {
	return (
		<View style={styles.container}>
			<Text>Tutorial do chat!</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		flex: 1,
		marginTop: StatusBar.currentHeight,
		backgroundColor: "transparent",
	},
});
