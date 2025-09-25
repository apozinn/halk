import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import useColorScheme from "../hooks/useColorScheme";

const tintColorLight = "#19dcdc";
const tintColorDark = "#19dcdc";

const colors = {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
    scale1: "#fff1",
    secondary: "#E0E0E0",
    appColor: "#00B0FF",
    icon: "rgba(139, 139, 139, 1)"
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
    scale1: "#222",
    secondary: "#E0E0E0",
    appColor: "#00B0FF",
    icon: "rgba(158, 158, 158, 0.07)"
  },
};

export function getColors() {
  const colorScheme = useColorScheme();

  return {
    ...colors[colorScheme],
    mainColor: colorScheme === "dark" ? "#000" : "#fff",
    secondaryColor: "#2f95dc",
    theme: colorScheme,
    defaultColors:
      colorScheme === "dark" ? DarkTheme.colors : DefaultTheme.colors,
  };
}

export default colors;
