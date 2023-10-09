import { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { Text, TextInput } from "../../src/components/Themed";
import { getColors } from "../../constants/Colors";
import StatusHeader from "../../src/components/statusHeader";
import { BufferContext } from "../../src/contexts/buffer";

export default function StatusView({ navigation, route }) {
	const [thisStatus, setThisStatus] = useState();
	const [author, setAuthor] = useState();
	const [stories, setStories] = useState();
	const colors = getColors();
	const { statusBuffer, updateBuffer } = useContext(BufferContext);

	useEffect(() => {
		if (!route.params) {
			return navigation.navigate("Root");
		}
		const stories = route.params.stories;
		const author = route.params.author;

		if (typeof stories === "object") {
			let _this;
			let pos = 0;

			while (!_this) {
				if (stories.length === 1) {
					_this = stories[0];
				} else {
					if (stories[pos]) {
						if (
							!statusBuffer.openned.some(
								(s) => s === stories[pos].id
							)
						) {
							if (stories[pos]) {
								_this = stories[pos];
							}
						}
					} else {
						_this = {};
						return navigation.navigate("Root");
					}
					pos++;
				}
			}
			setThisStatus(_this);
			setStories(stories);
			setAuthor(author);
			if (_this.id) {
				statusBuffer.openned.push(_this.id);
				updateBuffer({ statusBuffer });
			}
		} else navigation.navigate("Root");
	}, [navigation, route]);

	function previous() {
		const previousStatus = stories[stories.indexOf(thisStatus) - 1];
		if (previousStatus) {
			setThisStatus(previousStatus);
		} else {
			return navigation.goBack();
		}
	}

	function next() {
		const nextStatus = stories[stories.indexOf(thisStatus) + 1];
		if (nextStatus) {
			setThisStatus(nextStatus);
		} else {
			return navigation.goBack();
		}
	}

	return (
		<View style={[styles.container]}>
			{!thisStatus ? null : (
				<View
					style={{
						flex: 1,
						backgroundColor: thisStatus.color,
					}}
				>
					<StatusHeader
						{...{ navigation, author, thisStatus, stories }}
					/>
					<Pressable style={styles.textType}>
						{thisStatus.type === "text" ? (
							<Text
								style={{
									fontWeight: "bold",
									color: "white",
								}}
							>
								{thisStatus.content}
							</Text>
						) : (
							<Image source={thisStatus.content} />
						)}
						<Pressable
							style={[styles.intraButtons, { left: 0 }]}
							onPress={() => previous()}
						>
							<Text> </Text>
						</Pressable>
						<Pressable
							style={[styles.intraButtons, { right: 0 }]}
							onPress={() => next()}
						>
							<Text> </Text>
						</Pressable>
					</Pressable>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	textType: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	mediaType: {},
	intraButtons: {
		position: "absolute",
		width: "50%",
		height: "100%",
	},
});
