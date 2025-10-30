import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { HapticTab } from '@/components/ui/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import Colors, { getColors } from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Entypo, Feather } from '@expo/vector-icons';
import SearchChat from '@/components/ui/searchChat';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { ChatsContext } from '@/contexts/chats';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = getColors();
  const { chats } = useContext(ChatsContext);

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

  let unreadChats = 0;
  if (chats) {
    unreadChats = chats.filter((chat) =>
      chat?.messages?.some((m) => m?.read === false)
    ).length;
  }

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
      }}>
      <Tabs.Screen
        name="calls"
        options={{
          title: 'Calls',
          tabBarIcon: ({ color }) => <Ionicons name="call" size={28} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="index"
        options={({ navigation }) => ({
          title: "Chats",
          tabBarBadge: unreadChats,
          headerTitleStyle: {
            fontSize: 15,
            fontWeight: "bold",
            color: colors.tint,
          },
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbox-ellipses" size={24} color={color} />
          ),
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.navigate("/camera/camera")}
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
              <SearchChat navigation={navigation} />
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
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={28} color={color} />,
          headerShown: false,

        }}
      />
    </Tabs>
  );
}

