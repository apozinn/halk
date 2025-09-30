import * as React from "react";
import { Text } from "@/components/ui/Themed";
import { View, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Updates from "expo-updates";

interface ErrorBoundaryProps {
  colors: {
    background: string;
    tint: string;
  };
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: "There was an error, please restart the application."
  };

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: "There was an error, please restart the application." };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={[styles.container, { backgroundColor: this.props.colors.background }]}>
          <MaterialIcons name="error" size={100} color={this.props.colors.tint} />
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>Oops!</Text>
          <Text style={{ fontSize: 16, textAlign: "center" }}>
            {this.state.errorMessage}
          </Text>
          <Pressable
            style={styles.button}
            onPress={async () => await Updates.reloadAsync()}
          >
            <Text style={{ fontSize: 16, color: "white", fontWeight: "bold" }}>
              Try again
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