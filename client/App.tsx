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

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <UserProvider>
        <ChatsProvider>
          <SafeAreaProvider>
            <ErrorBoundary>
              <SocketProvider>
                <Navigation colorScheme={colorScheme} />
                <StatusBar />
              </SocketProvider>
            </ErrorBoundary>
          </SafeAreaProvider>
        </ChatsProvider>
      </UserProvider>
    );
  }
}
