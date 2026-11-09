import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import useColorScheme from "../hooks/useColorScheme";

const tintColorLight = "#19dcdc";
const tintColorDark = "#19dcdc";

const colors = {
  light: {
    text: "#1C1C1E",
    background: "#FFFFFF",
    tint: tintColorLight,
    tabIconDefault: "#8E8E93",
    tabIconSelected: tintColorLight,
    scale1: "#F2F2F7",
    secondary: "#E5E5EA",
    appColor: "#007AFF",
    icon: "#6C6C70",
    border: "#C7C7CC",
    messagesContainer: "#f3f3f3ff",
    otherUserMessageCard: "#dedede"
  },
  dark: {
    text: "#FFFFFF",
    background: "#000000",
    tint: tintColorDark,
    tabIconDefault: "#8E8E93",
    tabIconSelected: tintColorDark,
    scale1: "#1C1C1E",
    secondary: "#2C2C2E",
    appColor: "#0A84FF",
    icon: "#EBEBF5",
    border: "#38383A",
    messagesContainer: "#000000",
    otherUserMessageCard: "#404040"
  },
};

export function getColors() {
  const colorScheme = useColorScheme();

  return {
    ...colors[colorScheme],
    mainColor: colorScheme === "dark" ? "#000000" : "#FFFFFF",
    secondaryColor: "#2f95dc",
    theme: colorScheme,
    defaultColors:
      colorScheme === "dark" ? DarkTheme.colors : DefaultTheme.colors,
  };
}

export default colors;
