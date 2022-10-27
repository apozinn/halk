import {
  Entypo,
  Feather,
  Ionicons,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ColorSchemeName,
  Pressable,
  View,
  Platform,
  Button,
} from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Colors, { getColors } from "../constants/Colors";
import useColorScheme from "../src/hooks/useColorScheme";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { Text } from "../src/components/Themed";

import ChatsScreen from "../screens/app/chats";
import StatusScreen from "../screens/app/status";
import CallsScreen from "../screens/app/Calls";
import MenuScreen from "../screens/Menu/menu";

import RegisterScreen from "../screens/register/register";
import WelcomeScreen from "../screens/register/welcome";
import ReceiveCodeScreen from "../screens/register/receiveCode";
import CreateProfileScreen from "../screens/register/createProfile";
import ChatScreen from "../screens/chat/chat";
import ProfileScreen from "../screens/chat/profile";
import NewChatScreen from "../screens/app/newChat";

import SettingsScreen from "../screens/Menu/settings";
import CameraScreen from "../screens/app/camera";

import NotFoundScreen from "../screens/NotFoundScreen";

import SearchChat from "../src/components/searchChat";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReceiveCode"
        component={ReceiveCodeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateProfile"
        component={CreateProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewChat"
        component={NewChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const colors = getColors();
  const [searchChatVisibility, setSearchChatVisibility] = useState(false);
  const [chatSearch, setChatSearch] = useState("");

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

  return (
    <BottomTab.Navigator
      initialRouteName="Chats"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarHideOnKeyboard: true,
      }}
    >
      <BottomTab.Screen
        name="Chats"
        component={ChatsScreen}
        options={({ navigation }: RootTabScreenProps<"Chats">) => ({
          title: "Chats",
          headerTitleStyle: {
            fontSize: 15,
            fontWeight: "bold",
            color: colors.tint,
          },
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbox-ellipses" size={24} color={color} />
          ),
          headerStyle: {
            height:
              Platform.OS === "android" || Platform.OS === "ios" ? 60 : 40,
          },
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.navigate("Camera")}
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
                onPress={() => {}}
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
      <BottomTab.Screen
        name="Status"
        component={StatusScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="history-toggle-off" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name="Calls"
        component={CallsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="call" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="menu" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
    </BottomTab.Navigator>
  );
}
