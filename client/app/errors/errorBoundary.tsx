import * as React from "react";
import { Text } from "@/components/themed/Themed";
import { View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Updates from "expo-updates";
import { useTranslation } from "react-i18next";

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
  reloading: boolean;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: "errorBoundary.message",
    reloading: false,
  };

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: "errorBoundary.message",
      reloading: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = async () => {
    this.setState({ reloading: true });
    try {
      await Updates.reloadAsync();
    } catch (err) {
      console.error("Error reloading app:", err);
      this.setState({ reloading: false });
    }
  };

  renderErrorScreen(t: (key: string) => string) {
    const { colors } = this.props;
    const { reloading, errorMessage } = this.state;

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <MaterialIcons name="error" size={100} color={colors.tint} />
        <Text style={styles.title}>{t("errorBoundary.title")}</Text>
        <Text style={styles.message}>{t(errorMessage)}</Text>

        <Pressable
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={this.handleReload}
          disabled={reloading}
        >
          {reloading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t("errorBoundary.tryAgain")}</Text>
          )}
        </Pressable>
      </View>
    );
  }

  render() {
    return (
      <WithTranslation>
        {(t) =>
          this.state.hasError
            ? this.renderErrorScreen(t)
            : this.props.children
        }
      </WithTranslation>
    );
  }
}

function WithTranslation({
  children,
}: {
  children: (t: (key: string) => string) => React.ReactNode;
}) {
  const { t } = useTranslation();
  return <>{children(t)}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
    marginHorizontal: 15,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 25,
    minWidth: 140,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
