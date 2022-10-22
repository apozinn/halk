import { useState } from "react";
import { View, Image, Pressable, StyleSheet, StatusBar } from "react-native";
import { RootStackScreenProps } from "../../types";
import { Text } from "../../src/components/Themed";

export default function Welcome({
  navigation,
}: RootStackScreenProps<"Welcome">) {
  const [page, setPage] = useState(0);

  const pages = [
    {
      title: "Welcome to Halk!",
      description:
        "This is a basic and open source template of a real-time messaging app made in react-native and expo, visit the source code on our github, download and customize it however you want!",
      image: require("../../assets/images/favicon.png"),
    },
    {
      title: "Open source!",
      description:
        "All the source code is available on our github, visit us and give us your review of our app!",
      image: require("../../assets/images/openSource.png"),
    },
    {
      title: "Contribute whith us",
      description:
        "The best way to help us with development is by reporting bugs, and giving us ideas for changes and new features.",
      image: require("../../assets/images/contribute.png"),
    },
    {
      title: "Features",
      description: `
Below are some features of the app:

Exchange messages in real time with anyone
Make voice and video calls
Post status to your contacts 
Secure messages and calls
Create custom profiles
Customize the app as you like
`,
      image: require("../../assets/images/features.png"),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{pages[page].title}</Text>
      <Image source={pages[page].image} style={styles.image} />
      <Text style={styles.description}>{pages[page].description}</Text>
      <Pressable
        style={styles.button}
        onPress={() => {
          if (pages[page + 1]) {
            setPage(page + 1);
          } else navigation.navigate("Register");
        }}
      >
        <Text style={{ color: "white" }}>Continue</Text>
      </Pressable>
      <View style={styles.ballsContainer}>
        {pages.map((t, index) => (
          <Text
            style={[
              styles.ball,
              { backgroundColor: index === page ? "#2f95dc" : "#222" },
            ]}
            key={index}
          >
            {" "}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    marginVertical: 10,
  },
  image: {
    width: 250,
    height: 250,
  },
  description: {
    fontSize: 12,
    margin: 10,
    width: '90%',
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
});
