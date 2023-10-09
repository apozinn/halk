import { useEffect, useState } from "react";
import * as Progress from "react-native-progress";
import { Dimensions, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import {
	AntDesign,
	Ionicons,
	Feather,
	FontAwesome,
	MaterialIcons,
	Fontisto,
} from "@expo/vector-icons";
import { Userpic } from "react-native-userpic";
import { Text, TextInput } from "../../src/components/Themed";

export default function StatusHeader({ navigation, author, thisStatus, stories }) {
	const [statusTime, setStatusTime] = useState(0);
	const route = useRoute();

	useEffect(() => {
		let progress = 0;
		let intervalId;

		setStatusTime(progress);
		function upProgress() {
			progress += 0.0165;
			if (progress > 1) {
				clearInterval(intervalId);
				if (route.name === "StatusView") {
					const next = stories[stories.indexOf(thisStatus)+1];
					if (next && next !== thisStatus) {
						progress = 0;
						setStatusTime(0);
						navigation.navigate("StatusView", {
							author,
							stories,
						});
					} else return navigation.navigate("Root");
				}
			} else {
				setStatusTime(progress);
			}
		}

		intervalId = setInterval(() => upProgress(), 250);
	}, [navigation, author, thisStatus, stories, route]);

	return (
		<View style={{ padding: 2 }}>
			<View
				style={{
					alignItems: "center",
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				{stories.map((stj, index) => (
					<Progress.Bar
						key={index}
						progress={stj === thisStatus ? statusTime : 0}
						width={
							Dimensions.get("window").width / stories.length - 4
						}
						color="#fff"
					/>
				))}
			</View>
			<View style={styles.headerStatus}>
				<View style={styles.leftHeader}>
					<TouchableOpacity
						style={styles.button}
						onPress={() => {
							navigation.navigate("Root");
							navigation.reset({
								index: 0,
								routes: [{ name: "StatusView" }],
							});
						}}
					>
						<AntDesign name="arrowleft" size={25} color="white" />
					</TouchableOpacity>
					<Userpic
						size={40}
						name={author.profile.name}
						source={{ uri: author.profile.avatar }}
						colorize={true}
						style={{ marginHorizontal: 10 }}
					/>
					<Text style={{ fontWeight: "bold", color: "white" }}>
						{author.profile.name}
					</Text>
				</View>
				<TouchableOpacity style={styles.button} onPress={() => {}}>
					<Feather name="more-vertical" size={24} color="white" />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	headerStatus: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 5,
	},
	leftHeader: {
		flexDirection: "row",
		alignItems: "center",
	},
	rightHeader: {
		flexDirection: "row",
		alignItems: "center",
	},
	button: {
		marginTop: 5,
	},
});
