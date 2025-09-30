import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import useColorScheme from "@/hooks/useColorScheme";
import { UserProvider } from "@/contexts/user";
import { ChatsProvider } from "@/contexts/chats";
import { SocketProvider } from "@/contexts/socket";
import { BufferProvider } from "@/contexts/buffer";
import ErrorBoundary from "@/app/errors/errorBoundary";
import { getColors } from "@/constants/Colors";
import { MenuProvider } from "react-native-popup-menu";
import { SettingsProvider } from "@/contexts/settings";
import VerifyIfUserIsLogged from "@/components/verifyIsUserIsLogged";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = getColors();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary {...{ colors }}>
      <UserProvider>
        <ChatsProvider>
          <BufferProvider>
            <SettingsProvider>
              <SocketProvider>
                <MenuProvider>
                  <SafeAreaProvider>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                      <VerifyIfUserIsLogged>
                        <Stack screenOptions={{ headerShown: false }} />
                        <StatusBar style="auto" />
                      </VerifyIfUserIsLogged>
                    </ThemeProvider>
                  </SafeAreaProvider>
                </MenuProvider>
              </SocketProvider>
            </SettingsProvider>
          </BufferProvider>
        </ChatsProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}
