import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import {
	Ionicons,
	FontAwesome,
	MaterialIcons,
	Fontisto,
} from "@expo/vector-icons";
import { TextInput } from "@/components/themed/Themed";
import { getColors } from "../../constants/Colors";
import { UserContext } from "@/contexts/user";
import { SocketController } from "@/socket/socketController";
import { Chat } from "@/types";
import { t } from "i18next";

export default function BottomContent({ chat }: { chat: Chat }) {
	const { user } = useContext(UserContext);
	const [text, setText] = useState("");
	const colors = getColors();

	useEffect(() => {
		if (!chat || !user) return;
		const socketController = SocketController.getInstance({
			url: process.env.EXPO_PUBLIC_API_URL,
			token: user.id
		});

		socketController.emit("userTyping", {
			room: chat.id,
			typing: text.length === 0 ? false : true,
			userId: user.id,
		});
	}, [text]);

	function sendMessage() {
		if (!chat || !user) return;
		if (!text) return;
		const socketController = SocketController.getInstance({
			url: process.env.EXPO_PUBLIC_API_URL,
			token: user.id
		});
		socketController.sendMessage({ chat, messageContent: text });
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
				<TouchableOpacity style={{ ...styles.blueButton, backgroundColor: colors.tint }} onPress={() => { }}>
					<Fontisto name="camera" size={20} color="white" />
				</TouchableOpacity>
				<TextInput
					style={styles.inputMessage}
					placeholder={t("chat.sendAMessageInputPlaceHolder")}
					value={text}
					onChangeText={(value) => setText(value)}
					onSubmitEditing={() => sendMessage()}
					maxLength={4100}
					autoFocus={true}
				/>
			</View>
			{text ? (
				<TouchableOpacity
					style={{ ...styles.blueButton, backgroundColor: colors.tint }}
					onPress={() => sendMessage()}>
					<FontAwesome name="send" size={24} color="white" />
				</TouchableOpacity>
			) : (
				<View style={styles.othersMedias}>
					<TouchableOpacity onPress={() => { }}>
						<Ionicons
							name="add-circle-outline"
							size={26}
							color={colors.tint}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={{ marginLeft: 8 }}
						onPress={() => { }}
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
		backgroundColor: "rgb(18, 18, 18)",
		justifyContent: "space-between",
		padding: 5
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
		padding: 10,
		borderRadius: 50,
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
