import * as React from "react";
import { Text } from "../src/components/Themed";
import { View, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Updates from "expo-updates";

export default class ErrorBoundary extends React.Component {
  private errorInfo =
    "Houve um erro em nossos sistemas, por favor reinicie o aplicativo para corrigir o erro.";

  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.colors = props.colors;
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.errorInfo = errorInfo;
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={[
            styles.container,
            { backgroundColor: this.colors.background },
          ]}
        >
          <MaterialIcons name="error" size={100} color={this.colors.tint} />
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>Oops!</Text>
          <Text style={{ fontSize: 16, textAlign: "center" }}>
            {this.errorInfo}
          </Text>
          <Pressable
            style={styles.button}
            onPress={async () => await Updates.reloadAsync()}
          >
            <Text style={{ fontSize: 16, color: "white", fontWeight: "bold" }}>
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#2f95dc",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    marginTop: 30,
  },
});
