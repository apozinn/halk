import {} from 'react';
import { View, StylesSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';

export default function ChatsHeader({ colorScheme }) {
  return (
    <View></View>
  );
}

const styles = StylesSheet.create({
  header: {
    height: 30,
    backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.card : DefaultTheme.colors.card,
  },
})
