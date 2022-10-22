import { useState, useContext, useEffect } from "react";
import { View, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { RootStackScreenProps } from "../../types";
import { ChatsContext } from "../../src/contexts/chats";
import { UserContext } from "../../src/contexts/user";
import { TextInput, Text } from "../../src/components/Themed";
import { AntDesign } from "@expo/vector-icons";
import { getColors } from "../../constants/Colors";
import { searchUser } from "../../middleware/api";
import * as uuid from "uuid";
import { Userpic } from "react-native-userpic";

export default function NewChat({
  navigation,
}: RootStackScreenProps<"NewChat">) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { chats, updateChats } = useContext(ChatsContext);
  const { user } = useContext(UserContext);
  const colors = getColors();

  useEffect(() => {
    if (search) {
      searchUser(search).then((data) => setResults(data));
    }
  }, [search]);

  function generateKey() {
    const parts = [];
    for (let i = 0; i < 5; i++) {
      const numberSequence = Math.floor(
        Math.random() * (999999 - 100000 + 1) + 100000
      );
      parts.push(numberSequence);
    }

    return parts.join(" ");
  }

  async function goToChat(userChat) {
    const existsChat = chats.filter((c) => c.user.id === userChat.id)[0];
    if (existsChat) {
      return navigation.navigate("Chat", {
        id: existsChat.id,
      });
    }

    if (userChat.id === user.id) {
      return navigation.navigate("Root");
    }

    const newChat = {
      id: uuid.v4(),
      user: userChat,
      key: generateKey(),
      messages: [],
      newChat: true,
    };

    chats.push(newChat);
    updateChats({ chats });

    navigation.navigate("Chat", {
      id: newChat.id,
    });
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            borderBottomWidth: 1,
            borderBottomColor: colors.defaultColors.border,
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
          onPress={() => navigation.navigate("Root")}
        >
          <AntDesign name="arrowleft" size={25} color={colors.tint} />
        </Pressable>
        <TextInput
          style={[styles.input, { backgroundColor: colors.defaultColors.card }]}
          placeholder="Pesquisar"
          onChangeText={(value) => setSearch(value)}
          value={search}
        />
      </View>
      <ScrollView style={styles.results}>
        {!search ? (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 12 }}>
              Search for a user by name, username or ID
            </Text>
          </View>
        ) : (
          <>
            {results.map((user, index) => (
              <Pressable
                style={({ pressed }) => [
                  styles.userContainer,
                  {
                    backgroundColor: pressed
                      ? colors.defaultColors.card
                      : "transparent",
                  },
                ]}
                key={index}
                onPress={() => goToChat(user)}
              >
                <View style={styles.leftContent}>
                  <Userpic
                    size={50}
                    name={user.profile.name}
                    source={{ uri: user.profile.avatar }}
                    colorize={true}
                    borderRadius="50%"
                    style={{ marginRight: 10 }}
                  />
                  <View style={{ justifyContent: "center" }}>
                    <Text style={styles.username}>{user.profile.username}</Text>
                    <Text style={styles.name}>{user.profile.name}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  input: {
    padding: 5,
    borderRadius: 10,
    marginLeft: 10,
    width: "100%",
  },
  results: {
    flex: 1,
    margin: 10,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 5,
  },
  leftContent: {
    flexDirection: "row",
  },
  userIcon: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
  },
  name: {
    fontSize: 14,
  },
});
