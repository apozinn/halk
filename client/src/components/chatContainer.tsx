import React, { Component, ReactElement, createRef } from "react";
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import { Text } from "./Themed";
import { Userpic } from "react-native-userpic";
import CreateSocketConnectio from "../utils/socket";
import {
  Ionicons,
  FontAwesome,
  AntDesign,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import Modal from "react-native-modal";

class Chat extends Component {
  public scrollViewRef: React.RefObject<ScrollView> = createRef();
  public badgeProps = {
    size: 25,
    borderRadius: 50,
    animate: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isOnline: false,
      scrollOffset: null,
    };

    this.user = props.user;
    this.chats = props.chats;
    this.updateChats = props.updateChats;

    this.chat = props.chat;
    this.navigation = props.navigation;
    this.socket = props.socket;
    this.colors = props.colors;
  }

  handleOnScroll(event) {
    this.setState({ scrollOffset: event.nativeEvent.contentOffset.y });
  }

  handleScrollTo(p) {}

  open = () => this.setState({ visible: true } as any);
  close = () => this.setState({ visible: false } as any);
  isVisible = () => this.state.visible;

  executeAction(key, props) {
    try {
      if (key === "removeChat") {
        const chats = this.chats.filter((c) => c.id !== props.id);
        if (chats) {
          this.updateChats({ chats });
        }
      }
    } catch (err) {}
  }

  ModalChat() {
    return (
      <Modal
        testID={"ModalChat"}
        isVisible={this.isVisible()}
        onSwipeComplete={() => this.close()}
        swipeDirection={["down"]}
        scrollTo={this.handleScrollTo}
        scrollOffset={this.state.scrollOffset}
        scrollOffsetMax={100}
        propagateSwipe={true}
        style={styles.modal}
      >
        <View style={styles.scrollableModal}>
          <ScrollView onScroll={this.handleOnScroll} scrollEventThrottle={16}>
            <View style={styles.modalBarContainer}>
              <View style={styles.modalBar}></View>
            </View>

            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor:
                    this.colors.theme === "dark"
                      ? this.colors.defaultColors.card
                      : this.colors.defaultColors.background,
                },
              ]}
            >
              <View
                style={[
                  styles.modalTopProfile,
                  { backgroundColor: this.colors.background },
                ]}
              >
                <Userpic
                  size={50}
                  name={this.chat.user.profile.name}
                  source={{ uri: this.chat.user.profile.avatar }}
                  colorize={true}
                  borderRadius="50%"
                  badge={true}
                  badgeColor={this.state.isOnline ? "#00ff0d" : "#919191"}
                  badgePosition={"bottom-right"}
                  badgeProps={this.badgeProps}
                  style={{ marginRight: 10 }}
                />
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  {this.chat.user.profile.name}
                </Text>
              </View>

              <View style={styles.modalLinks}>
                <TouchableOpacity style={styles.modalLink}>
                  <FontAwesome
                    name="user-circle"
                    size={26}
                    color={this.colors.tint}
                  />
                  <Text style={styles.modalLinkText}>Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLink}>
                  <AntDesign name="star" size={26} color={this.colors.tint} />
                  <Text style={styles.modalLinkText}>Fixar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLink}>
                  <MaterialIcons
                    name="mark-chat-read"
                    size={26}
                    color={this.colors.tint}
                  />
                  <Text style={styles.modalLinkText}>Marcar como lida</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLink}>
                  <MaterialIcons
                    name="notification-important"
                    size={26}
                    color={this.colors.tint}
                  />
                  <Text style={styles.modalLinkText}>
                    Config. de notificação
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalLink}
                  onPress={() => this.executeAction("removeChat", this.chat)}
                >
                  <MaterialIcons
                    name="delete"
                    size={26}
                    color={this.colors.tint}
                  />
                  <Text style={styles.modalLinkText}>Excluir conversa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLink}>
                  <Entypo name="block" size={26} color={this.colors.tint} />
                  <Text style={styles.modalLinkText}>Bloquear usuário</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLink}>
                  <MaterialIcons
                    name="report"
                    size={26}
                    color={this.colors.tint}
                  />
                  <Text style={styles.modalLinkText}>Denúnciar usuário</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLink}>
                  <Ionicons name="copy" size={26} color={this.colors.tint} />
                  <Text style={styles.modalLinkText}>Copiar ID</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }

  render() {
    const lastMessage = this.chat.messages[this.chat.messages.length - 1];
    if (!lastMessage) return null;
    const unredMessages = this.chat.messages.filter(
      (m) => m.read === false && m.author.id !== this.user.id
    );
    const messageTime = new Date(lastMessage.createdAt).toLocaleTimeString();
    if (this.socket) {
      this.socket.emit("verifyIfUserIsOnline", { userId: this.chat.user.id });
      this.socket.on(
        "receiveIfUserIsOnline",
        (callback) => (this.state.isOnline = callback)
      );
    }

    return (
      <TouchableOpacity
        style={styles.chatContainer}
        onPress={() => {
          this.navigation.navigate("Chat", {
            id: this.chat.id,
          });
        }}
        onLongPress={() => this.open()}
      >
        <>{this.ModalChat()}</>
        <View style={{ flexDirection: "row" }}>
          <Userpic
            size={50}
            name={this.chat.user.profile.name}
            source={{ uri: this.chat.user.profile.avatar }}
            colorize={true}
            borderRadius="50%"
            badge={true}
            badgeColor={this.state.isOnline ? "#00ff0d" : "#919191"}
            badgePosition={"bottom-right"}
            badgeProps={this.badgeProps}
            style={{ marginRight: 10 }}
          />
          <View style={{ justifyContent: "center" }}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>
              {this.chat.user.profile.name}
            </Text>
            {lastMessage.author.id === this.user.id ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="checkmark-done"
                  size={20}
                  color={lastMessage.read ? "#2f95dc" : "gray"}
                  style={{ marginRight: 2 }}
                />
                <Text style={styles.messageContent}>
                  {lastMessage.content.length > 28 ? lastMessage.content.slice(0, 28) + "..." : lastMessage.content}
                </Text>
              </View>
            ) : (
              <Text>
                {lastMessage.content.length > 30 ? lastMessage.content.slice(0, 30) + "..." : lastMessage.content}
              </Text>
            )}
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.messageDate}>{messageTime.slice(0, 5)}</Text>
          {!unredMessages.length ? (
            <></>
          ) : (
            <Text style={styles.unread}>{unredMessages.length}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  chatContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 5,
  },
  messageContent: {
    fontSize: 13,
    opacity: 0.7,
    alignItems: "center",
  },
  messageDate: {
    fontSize: 11,
    marginBottom: 3,
  },
  unread: {
    backgroundColor: "#2f95dc",
    borderRadius: 100,
    minWidth: 15,
    minHeight: 15,
    textAlign: "center",
    color: "white",
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
});

export default Chat;
