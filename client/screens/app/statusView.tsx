import { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { Text, TextInput } from "../../src/components/Themed";
import { getColors } from "../../constants/Colors";
import StatusHeader from "../../src/components/statusHeader";
import { BufferContext } from '../../src/contexts/buffer';

export default function StatusView({ navigation, route }) {
	const [thisStatus, setThisStatus] = useState();
	const [author, setAuthor] = useState();
	const [stories, setStories] = useState();
	const colors = getColors(); 
	const { buffer, updateBuffer } = useContext(BufferContext);

	useEffect(() => {
		return;
		const stories = route.params.stories;
		const author = route.params.author;

		if (typeof stories === "object") {
			let _this;
			let pos = 0;

			while(!_this) {
				if(stories.length === 1) {
					_this = stories[0];
				} else {
					if(!buffer.status.openned.some((s) => s.id === stories[pos].id)) {
						_this = stories[pos];
					} 
					pos++;
				}
			}
			setThisStatus(_this);
			setStories(stories);
			setAuthor(author);
			buffer.status.openned.push(thisStatus);
			updateBuffer(buffer);
		} else navigation.navigate("Root");
	}, [navigation, route]);

	const generateColor = () => {
		const randomColor = Math.floor(Math.random() * 16777215)
			.toString(16)
			.padStart(6, "0");
		return `#${randomColor}`;
	};

	return (
		<View style={[styles.container]}>
			{!thisStatus ? null : (
				<View
					style={{
						flex: 1,
						backgroundColor: generateColor(),
					}}
				>
					<StatusHeader {...{ navigation, author, thisStatus, stories }} />
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
});
