import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { MenuProvider } from "react-native-popup-menu";
import { useFonts } from "expo-font";

import { UserProvider } from "@/contexts/user";
import { ChatsProvider } from "@/contexts/chats";
import { SettingsProvider } from "@/contexts/settings";
import VerifyIfUserIsLogged from "@/components/verifiers/verifyIsUserIsLogged";
import SocketListener from "@/socket/socketListener";
import ErrorBoundary from "@/app/errors/errorBoundary";
import useColorScheme from "@/hooks/useColorScheme";
import { getColors } from "@/constants/Colors";
import { initI18n } from "@/i18n";

import { LogBox } from "react-native";

LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = getColors();
  const [i18nReady, setI18nReady] = useState(false);

  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    initI18n().then(() => setI18nReady(true));
  }, []);

  if (!i18nReady || !fontsLoaded) {
    return (
      <SafeAreaProvider>
        <ActivityIndicator
          size="large"
          style={{ flex: 1, justifyContent: "center" }}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <ErrorBoundary {...{ colors }}>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <MenuProvider>
            <UserProvider>
              <ChatsProvider>
                <SettingsProvider>
                  <VerifyIfUserIsLogged>
                    <SocketListener />
                    <Stack screenOptions={{ headerShown: false }} />
                    <StatusBar style="auto" />
                  </VerifyIfUserIsLogged>
                </SettingsProvider>
              </ChatsProvider>
            </UserProvider>
          </MenuProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
