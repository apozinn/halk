import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./src/hooks/useCachedResources";
import useColorScheme from "./src/hooks/useColorScheme";
import Navigation from "./navigation";
import { UserProvider } from "./src/contexts/user";
import { ChatsProvider } from "./src/contexts/chats";
import { SocketProvider } from "./src/contexts/socket";
import { BufferProvider } from "./src/contexts/buffer";
import ErrorBoundary from "./screens/errorBoundary";
import { CreateSocketConnection } from "./src/utils/socket";
import { getColors } from "./constants/Colors";
import { MenuProvider } from "react-native-popup-menu";
import { SettingsProvider } from "./src/contexts/settings";
import { View, Text } from "react-native";
import { useEffect } from "react";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const colors = getColors();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ErrorBoundary {...{ colors }}>
        <UserProvider>
          <ChatsProvider>
            <BufferProvider>
              <SettingsProvider>
                <SocketProvider>
                  <SafeAreaProvider>
                    <MenuProvider>
                      <Navigation colorScheme={colorScheme} />
                    </MenuProvider>
                  </SafeAreaProvider>
                </SocketProvider>
              </SettingsProvider>
            </BufferProvider>
          </ChatsProvider>
        </UserProvider>
      </ErrorBoundary>
    );
  }
}
