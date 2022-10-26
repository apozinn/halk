import { Component, createRef } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  StatusBar,
  Pressable,
  TouchableOpacity,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  Feather,
  FontAwesome,
  MaterialIcons,
  Fontisto,
  Entypo,
} from "@expo/vector-icons";
import { Cipher, Decipher } from "../../middleware/crypto";
import { Text } from "./Themed";
import Modal from "react-native-modal";
import { Userpic } from "react-native-userpic";

class MessagesContainer extends Component {
  private scrollViewRef = null;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      scrollOffset: null,
      messageModal: null,
      messageModalContent: "",
    };

    this.user = props.user;
    this.chats = props.chats;
    this.updateChats = props.updateChats;
    this.chat = props.chat;
    this.colors = props.colors;
  }

  handleOnScroll(event) {
    this.setState({ scrollOffset: event.nativeEvent.contentOffset.y });
  }

  handleScrollTo(p) {}

  open = () => this.setState({ visible: true } as any);
  close = () => this.setState({ visible: false } as any);
  isVisible = () => this.state.visible;

  ModalMessage() {
    if (!this.state.messageModal) return;
    return (
      <Modal
        testID={"ModalMessage"}
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
                  size={40}
                  name={this.state.messageModal.author.profile.name}
                  source={{
                    uri: this.state.messageModal.author.profile.avatar,
                  }}
                  colorize={true}
                  borderRadius="50%"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ fontWeight: "bold" }}>
                  {this.state.messageModalContent}
                </Text>
              </View>
              <View style={styles.modalLinks}>
                <TouchableOpacity style={styles.modalLink}>
                  <Entypo name="reply" size={26} color={this.colors.tint} />
                  <Text style={styles.modalLinkText}>Responder</Text>
                </TouchableOpacity>
                {this.state.messageModal.author.id !== this.user.id ? (
                  <></>
                ) : (
                  <TouchableOpacity style={styles.modalLink}>
                    <MaterialIcons
                      name="delete"
                      size={26}
                      color={this.colors.tint}
                    />
                    <Text style={styles.modalLinkText}>Apagar mensagem</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.modalLink}>
                  <MaterialIcons
                    name="push-pin"
                    size={26}
                    color={this.colors.tint}
                  />
                  <Text style={styles.modalLinkText}>Fixar mensagem</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLink}>
                  <Entypo name="link" size={26} color={this.colors.tint} />
                  <Text style={styles.modalLinkText}>Compartilhar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLink}>
                  <MaterialIcons
                    name="emoji-emotions"
                    size={26}
                    color={this.colors.tint}
                  />
                  <Text style={styles.modalLinkText}>Reagir a mensagem</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalLink}>
                  <Ionicons name="copy" size={26} color={this.colors.tint} />
                  <Text style={styles.modalLinkText}>Copiar conteúdo</Text>
                </TouchableOpacity>
                {this.state.messageModal.author.id === this.user.id ? (
                  <></>
                ) : (
                  <TouchableOpacity style={styles.modalLink}>
                    <MaterialIcons
                      name="report"
                      size={26}
                      color={this.colors.tint}
                    />
                    <Text style={styles.modalLinkText}>Denúnciar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <ScrollView
        style={styles.messageContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {this.ModalMessage()}
        {this.chat.messages.map((message, index) => {
          const itsMyMessage =
            message.author.id === this.user.id ? true : false;
          const messageTime = new Date(message.createdAt).toLocaleTimeString();

          let content = Decipher(message.content, this.chat.id);
          if (!content) content = "Falha na descriptografia";

          let previousMessageIsMy =
            this.chat.messages[index - 1]?.author.id === message.author.id;
          let nextMessageIsMy =
            this.chat.messages[index + 1]?.author.id === message.author.id;

          let borders = {};

          if (itsMyMessage) {
            borders.borderTopRightRadius =
              previousMessageIsMy && !nextMessageIsMy ? 5 : 20;
            borders.borderBottomRightRadius =
              !previousMessageIsMy && nextMessageIsMy ? 5 : 20;

            if (previousMessageIsMy && nextMessageIsMy) {
              borders.borderTopRightRadius = 5;
              borders.borderBottomRightRadius = 5;
            }
          } else {
            borders.borderTopLeftRadius =
              previousMessageIsMy && !nextMessageIsMy ? 5 : 20;
            borders.borderBottomLeftRadius =
              !previousMessageIsMy && nextMessageIsMy ? 5 : 20;

            if (previousMessageIsMy && nextMessageIsMy) {
              borders.borderTopLeftRadius = 10;
              borders.borderBottomLeftRadius = 10;
            }
          }

          return (
            <View
              style={[
                itsMyMessage ? styles.myMessage : styles.otherMessage,
                index === 0 ? { margintop: 10 } : {},
              ]}
              key={index}
            >
              <View style={itsMyMessage ? { maxWidth: "75%" } : {}}>
                <Pressable
                  style={[
                    styles.message,
                    borders,
                    {
                      backgroundColor: itsMyMessage
                        ? "#2f95dc"
                        : this.colors.defaultColors.card,
                    },
                  ]}
                  onLongPress={() => {
                    this.setState({
                      messageModal: message,
                      messageModalContent: content,
                    });
                    this.open();
                  }}
                >
                  <Text
                    style={{
                      maxWidth: "100%",
                      color: itsMyMessage
                        ? "white"
                        : this.colors.defaultColors.text,
                    }}
                  >
                    {content}
                  </Text>
                </Pressable>
                <View
                  style={[
                    styles.messageProps,
                    {
                      justifyContent: itsMyMessage ? "flex-end" : "flex-start",
                    },
                  ]}
                >
                  {nextMessageIsMy ? (
                    <></>
                  ) : (
                    <>
                      <Text style={styles.messageCreatedAt}>
                        {messageTime.slice(0, 5)}
                      </Text>
                      {itsMyMessage ? (
                        <Ionicons
                          name="checkmark-done"
                          size={20}
                          color={message.read ? "#04f500" : "gray"}
                          style={{ marginRight: 2 }}
                        />
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    marginHorizontal: 10,
    flexDirection: "column-reverse",
    marginBottom: 55,
  },
  myMessage: {
    justifyContent: "flex-end",
    flexDirection: "revert",
  },
  otherMessage: {
    width: "fit-content",
    maxWidth: "75%",
  },
  message: {
    padding: 7,
    borderRadius: 20,
    flexDirection: "row",
    marginBottom: 2,
    alignItems: "baseline",
    flexWrap: "wrap",
  },
  messageCreatedAt: {
    fontSize: 10,
    marginHorizontal: 5,
    marginTop: 5,
  },
  messageProps: {
    flexDirection: "row",
    alignItems: "center",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  scrollableModal: {
    minHeight: 400,
  },
  modalContent: {
    height: 400,
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

export default MessagesContainer;
