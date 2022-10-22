import translate from '@vitalets/google-translate-api';
import { Platform, NativeModules } from 'react-native'

export default async function Translate(text:string) {
    let language

    switch(Platform.OS) {
        case 'ios': {
            language = NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0];
        } break;
        case 'android': {
            language =  NativeModules.I18nManager.localeIdentifier;
        } break;
        case 'web': {
            language = window.navigator.language;
        } break;
        default: {
            language = 'en';
        }
    }

    const res = await translate(text, {to: language.split('-')[0]});
    return res.text;
}