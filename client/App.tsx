import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./src/hooks/useCachedResources";
import useColorScheme from "./src/hooks/useColorScheme";
import Navigation from "./navigation";
import { UserProvider } from "./src/contexts/user";
import { ChatsProvider } from "./src/contexts/chats";
import { SocketProvider } from "./src/contexts/socket";
import ErrorBoundary from "./screens/errorBoundary";
import { CreateSocketConnection } from "./src/utils/socket";
import { getColors } from "./constants/Colors";
import { MenuProvider } from "react-native-popup-menu";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const colors = getColors();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <UserProvider>
        <ChatsProvider>
          <SafeAreaProvider>
            <ErrorBoundary {...{ colors }}>
              <SocketProvider>
                <MenuProvider>
                  <Navigation colorScheme={colorScheme} />
                  <StatusBar />
                </MenuProvider>
              </SocketProvider>
            </ErrorBoundary>
          </SafeAreaProvider>
        </ChatsProvider>
      </UserProvider>
    );
  }
}
