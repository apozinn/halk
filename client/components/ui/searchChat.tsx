import { useState, useContext, useEffect, createRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { TextInput, Text } from "./Themed";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { getColors } from "../../constants/Colors";
import { UserContext } from "@/contexts/user";
import { ChatsContext } from "@/contexts/chats";
import { Avatar } from '@kolking/react-native-avatar';
import Modal from "react-native-modal";
import { useRouter } from "expo-router";
import EvilIcons from '@expo/vector-icons/EvilIcons';

export default function SearchChat() {
  const { user } = useContext(UserContext);
  const { chats } = useContext(ChatsContext);
  const [visible, setVisible] = useState(false);
  const [scrollOffset, setScrollOfSet] = useState();
  const [search, setSearch] = useState("");
  const colors = getColors();
  const navigation = useRouter();
  const scrollViewRef = createRef();

  const handleOnScroll = (event) => {
    setScrollOfSet(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = (p) => { };

  const close = () => setVisible(false);
  const open = () => setVisible(true);
  const isVisible = () => visible;

  function SearchModal() {
    return (
      <Modal
        testID={"ModalSearch"}
        isVisible={isVisible()}
        onSwipeComplete={() => close()}
        swipeDirection={["down"]}
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        scrollOffsetMax={100}
        propagateSwipe={true}
        style={styles.modal}
        onBackButtonPress={() => close()}
        onBackdropPress={() => close()}
      >
        <View style={styles.scrollableModal}>
          <ScrollView onScroll={handleOnScroll} scrollEventThrottle={16}>
            <View style={styles.modalBarContainer}>
              <View style={styles.modalBar}></View>
            </View>

            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor:
                    colors.theme === "dark"
                      ? colors.defaultColors.card
                      : colors.defaultColors.background,
                },
              ]}
            >
              <ScrollView
                style={styles.chatsPreview}
                horizontal={true}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                {chats.map(
                  (chat, index) => (
                    <TouchableOpacity style={styles.chatPw} key={index}>
                      <Avatar
                        size={50}
                        name={chat.user.profile.name}
                        source={{ uri: chat.user.profile.avatar }}
                        colorize={true}
                        radius={50}
                      />
                    </TouchableOpacity>
                  )
                )}
              </ScrollView>
              <View
                style={[
                  styles.searchContainer,
                  { borderBottomColor: colors.defaultColors.border },
                ]}
              >
                <TextInput
                  placeholder="Pesquisar"
                  onChangeText={(value) => setSearch(value)}
                  style={[
                    styles.searchInput,
                    { backgroundColor: colors.defaultColors.card },
                  ]}
                />
              </View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                {!search ? <></> : <>{chats
                  .filter(
                    (chat) =>
                      chat.user.profile.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      chat.user.profile.username
                        .toLowerCase()
                        .includes(search.toLowerCase())
                  )
                  .map((chat, index) => (
                    <TouchableOpacity
                      style={styles.chatContent}
                      onPress={() =>
                        navigation.navigate("Chat", { id: chat.id })
                      }
                      key={index}
                    >
                      <Avatar
                        size={50}
                        name={chat.user.profile.name}
                        source={{ uri: chat.user.profile.avatar }}
                        colorize={true}
                                                radius={50}

                      />
                      <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                          {chat.user.profile.name}
                        </Text>
                        <Text style={{ fontSize: 13 }}>
                          {chat.user.profile.username}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}</>}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }

  return (
    <View>
      <TouchableOpacity
        onPress={() => open()}
        style={{
          marginRight: 10,
        }}
      >
        <EvilIcons name="search" size={28} color={colors.tint} />
      </TouchableOpacity>
      {SearchModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  inputContainer: {
    height: Platform.OS === "android" || Platform.OS === "ios" ? 43 : 40,
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 10,
    width: "85%",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  scrollableModal: {
    minHeight: 500,
  },
  modalContent: {
    height: 500,
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTopProfile: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 50,
  },
  modalLinks: {},
  modalLink: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  modalLinkText: {
    marginLeft: 10,
    fontSize: 17,
  },
  modalBarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalBar: {
    backgroundColor: "#fff",
    width: 60,
    height: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  chatsPreview: {
    flexDirection: "row",
    padding: 10,
    maxHeight: 70,
  },
  chatPw: {
    marginRight: 10,
  },
  searchContainer: {
    borderBottomWidth: 1,
    padding: 10,
    margintop: 10,
  },
  searchInput: {
    borderRadius: 10,
    width: "100%",
    height: 40,
    padding: 10,
  },
  chatContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    marginBottom: 10,
  },
});
