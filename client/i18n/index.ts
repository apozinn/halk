import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import pt from './locales/pt.json';
import en from './locales/en.json';

const LANGUAGE_KEY = 'app-language';

const resources = {
  en: { translation: en },
  pt: { translation: pt },
};

async function getSavedLanguage() {
  const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
  if (saved) return saved;

  const sysLang = Localization.getLocales()[0].languageCode;
  return sysLang === 'pt' ? 'pt' : 'en';
}

export async function initI18n() {
  const lng = await getSavedLanguage();

  await i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
}

export async function changeLanguage(lng: string) {
  await i18n.changeLanguage(lng);
  await AsyncStorage.setItem(LANGUAGE_KEY, lng);
}

export default i18n;
