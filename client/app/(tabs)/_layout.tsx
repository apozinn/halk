import { Tabs } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { HapticTab } from '@/components/ui/HapticTab';
import Colors, { getColors } from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Entypo, Feather } from '@expo/vector-icons';
import SearchChat from '@/components/ui/searchChat';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { ChatsContext } from '@/contexts/chats';
import { t } from 'i18next';

import { useRouter } from "expo-router";


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = getColors();
  const { chats, updateChats } = useContext(ChatsContext);
  const [unreadChats, setUnreadChats] = React.useState(0);

  const router = useRouter();

  const optionsStyles = {
    optionsContainer: {
      backgroundColor: colors.defaultColors.card,
      padding: 5,
      top: 0,
    },
  };
  const optionStyles = {
    optionText: {
      color: colors.text,
      fontSize: 15,
    },
  };

  useEffect(() => {
    if (!chats) return;
    setUnreadChats(chats.filter((chat) =>
      chat?.messages?.some((m) => m?.read === false)
    ).length);
  }, [chats]);

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="calls"
        options={{
          title: t("tabs.titles.calls"),
          tabBarIcon: ({ color }) => <Ionicons name="call" size={28} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="index"
        options={({ navigation }) => ({
          title: t("tabs.titles.chats"),
          tabBarBadge: unreadChats > 0 ? unreadChats : undefined,
          headerTitleStyle: {
            fontSize: 15,
            fontWeight: "bold",
            color: colors.tint,
          },
          headerStyle: {
            height: Platform.OS === "android" ? 70 : undefined,
          },
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbox-ellipses" size={24} color={color} />
          ),
          headerLeft: () => (
            <Pressable
              onPress={() => router.navigate("camera/camera")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                marginLeft: 5,
              })}
            >
              <Entypo name="camera" size={22} color={colors.tint} />
            </Pressable>
          ),
          headerRight: () => (
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                marginRight: 5,
              }}
            >
              <SearchChat />
              <Pressable
                onPress={() => { }}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <Menu>
                  <MenuTrigger>
                    <Feather
                      name="more-vertical"
                      size={22}
                      color={colors.tint}
                    />
                  </MenuTrigger>
                  <MenuOptions customStyles={optionsStyles}>
                    <MenuOption
                      onSelect={() => alert(`Save`)}
                      text="Novo chat"
                      customStyles={optionStyles}
                    />
                    <MenuOption
                      onSelect={() => alert(`Save`)}
                      text="Novo Grupo"
                      customStyles={optionStyles}
                    />
                    <MenuOption
                      onSelect={() => alert(`Save`)}
                      text="Mensagens fixadas"
                      customStyles={optionStyles}
                    />
                    <MenuOption
                      onSelect={() => alert(`Save`)}
                      text="Editar perfil"
                      customStyles={optionStyles}
                    />
                    <MenuOption
                      onSelect={() => alert(`Save`)}
                      text="Configurações"
                      customStyles={optionStyles}
                    />
                  </MenuOptions>
                </Menu>
              </Pressable>
            </View>
          ),
        })}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.titles.settings"),
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={28} color={color} />,
          headerShown: false,

        }}
      />
    </Tabs>
  );
}

