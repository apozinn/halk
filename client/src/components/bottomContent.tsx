import React, { useEffect, useState, useContext, useRef } from "react";
import { Button, StyleSheet, View, TouchableOpacity } from "react-native";
import {
	AntDesign,
	Ionicons,
	Feather,
	FontAwesome,
	MaterialIcons,
	Fontisto,
} from "@expo/vector-icons";
import { TextInput, Text } from "./Themed";
import { getColors } from "../../constants/Colors";
import { UserContext } from "../contexts/user";
import { ChatsContext } from "../contexts/chats";
import { SocketContext } from "../contexts/socket";
import { SocketController } from "../utils/socket";

export default function BottomContent({ chat }) {
	const { user } = useContext(UserContext);
	const { chats, updateChats } = useContext(ChatsContext);
	const socket = useContext(SocketContext);

	const [text, setText] = useState("");
	const [userTyping, setUserTyping] = useState(false);

	const colors = getColors();

	useEffect(() => {
		if (!socket || !chat) return;
		if (text.length === 0) {
			// socket.emit("userTyping", {
			// 	room: chat.id,
			// 	typing: false,
			// 	userId: user.id,
			// });
		} else {
			// socket.emit("userTyping", {
			// 	room: chat.id,
			// 	typing: true,
			// 	userId: user.id,
			// });
		}

		// socket.on("userTyping", (t) => {
		// 	if (t.userId === user.id) return;
		// 	setUserTyping(t.typing);
		// });
	}, [text]);

	function sendMessage() {
		if (!text) return;
		new SocketController.sendMessage({
			user,
			chats,
			updateChats,
			chat,
			socket,
			text,
		});
		setText("");
	}

	return (
		<View
			style={[
				styles.bottomContainer,
				{ backgroundColor: colors.defaultColors.card },
			]}
		>
			<View style={styles.buttonContentLeft}>
				<TouchableOpacity style={styles.blueButton} onPress={() => {}}>
					<Fontisto name="camera" size={20} color="white" />
				</TouchableOpacity>
				<TextInput
					style={styles.inputMessage}
					placeholder="Mensagem..."
					value={text}
					onChangeText={(value) => setText(value)}
					onSubmitEditing={() => sendMessage()}
					maxLength={4100}
					autoFocus={true}
				/>
			</View>
			{text ? (
				<TouchableOpacity
					style={styles.blueButton}
					onPress={() => sendMessage()}
				>
					<FontAwesome name="send" size={24} color="white" />
				</TouchableOpacity>
			) : (
				<View style={styles.othersMedias}>
					<TouchableOpacity onPress={() => {}}>
						<Ionicons
							name="ios-add-circle-outline"
							size={26}
							color={colors.tint}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={{ marginLeft: 8 }}
						onPress={() => {}}
					>
						<MaterialIcons
							name="keyboard-voice"
							size={26}
							color={colors.tint}
						/>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	bottomContainer: {
		flexDirection: "row",
		alignItems: "center",
		position: "absolute",
		backgroundColor: "rgb(18, 18, 18)",
		justifyContent: "space-between",
		borderRadius: 50,
		bottom: 0,
		left: 0,
		right: 0,
		padding: 5,
		margin: 5,
	},
	button: {
		padding: 5,
	},
	buttonContentLeft: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "80%",
	},
	blueButton: {
		backgroundColor: "#2f95dc",
		padding: 8,
		borderRadius: 100,
	},
	othersMedias: {
		flexDirection: "row",
		alignItems: "center",
	},
	inputMessage: {
		paddingVertical: 8,
		width: "100%",
		marginLeft: 10,
	},
});
