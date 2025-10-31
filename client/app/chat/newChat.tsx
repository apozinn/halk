import { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Avatar } from "@kolking/react-native-avatar";
import uuid from "react-native-uuid";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { ChatsContext } from "@/contexts/chats";
import { UserContext } from "@/contexts/user";
import { Text, TextInput } from "@/components/themed/Themed";
import { getColors } from "@/constants/Colors";
import { searchUser } from "@/middleware/api";
import { ThemedSafeAreaView } from "@/components/themed/themedSafeAreaView";
import { Chat } from "@/types";

export default function NewChat() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const { chats, updateChats } = useContext(ChatsContext);
  const { user } = useContext(UserContext);
  const colors = getColors();
  const navigation = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if(!user) return;
    if (search.trim()) {
      searchUser(user.id, search).then((data) => {
        setResults(data || []);
      });
    } else {
      setResults([]);
    }
  }, [search]);

  async function goToChat(userChat: any) {
    const existsChat = chats.find((c) => c.user.id === userChat.id);
    if (existsChat) {
      return navigation.navigate({
        pathname: "chat/chat",
        params: { id: existsChat.id },
      });
    }

    const newChat: Chat = {
      id: uuid.v4(),
      user: userChat,
      messages: [],
      newChat: true,
    };

    chats.push(newChat);
    updateChats(chats);

    navigation.navigate({
      pathname: "/chat/chat",
      params: {
        id: newChat.id,
      }
    });
  }

  return (
    <ThemedSafeAreaView>
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
          onPress={() => navigation.navigate("/")}
        >
          <AntDesign name="arrow-left" size={25} color={colors.tint} />
        </Pressable>
        <TextInput
          style={[styles.input, { backgroundColor: colors.defaultColors.card }]}
          placeholder={t("newChat.searchPlaceholder")}
          onChangeText={(value) => setSearch(value)}
          value={search}
        />
      </View>

      <ScrollView style={styles.results}>
        {!search.trim() ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {t("newChat.emptyMessage")}
            </Text>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {t("newChat.noResults")}
            </Text>
          </View>
        ) : (
          results.map((userItem, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.userContainer,
                {
                  backgroundColor: pressed
                    ? colors.defaultColors.card
                    : "transparent",
                },
              ]}
              onPress={() => goToChat(userItem)}
            >
              <View style={styles.leftContent}>
                <Avatar
                  size={60}
                  radius={50}
                  name={userItem.profile.username}
                  colorize
                  source={
                    userItem.profile.avatar?.length
                      ? { uri: userItem.profile.avatar }
                      : undefined
                  }
                />
                <View style={{ justifyContent: "center", marginLeft: 10 }}>
                  <Text style={styles.username}>
                    {userItem.profile.username}
                  </Text>
                  <Text style={styles.name}>{userItem.profile.name}</Text>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
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
  username: {
    fontWeight: "bold",
  },
  name: {
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 13,
    opacity: 0.8,
    textAlign: "center",
    marginHorizontal: 20,
  },
});
