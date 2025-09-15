import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "@/hooks/useCachedResources";
import useColorScheme from "@/hooks/useColorScheme";
import { UserProvider } from "@/contexts/user";
import { ChatsProvider } from "@/contexts/chats";
import { SocketProvider } from "@/contexts/socket";
import { BufferProvider } from "@/contexts/buffer";
import ErrorBoundary from "./app/errorBoundary";
import { getColors } from "@/constants/Colors";
import { MenuProvider } from "react-native-popup-menu";
import { SettingsProvider } from "@/contexts/settings";
import { StatusBar } from 'expo-status-bar';

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
                      <StatusBar/>
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