import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Chats: 'chats',
          Status: 'status',
          Calls: 'calls',
          Menu: 'menu',
        },
      },
      Welcome: 'welcome',
      Register: 'register',
      ReceiveCode: 'receiveCode',
      CreateProfile: 'createProfile',
      Chat: 'chat',
      Camera: 'camera',
      NewChat: 'newChat',
      Profile: 'profile',
      Settings: 'settings',
      StatusSettings: 'statusSettings',
      NotFound: '*',
    },
  },
};

export default linking;
