import i18n, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { Platform } from 'react-native';

import en from '@/assets/translations/en';
import es from '@/assets/translations/es';

const getLang = () => {
  if (Platform.OS === "web") {
    return navigator.language;
  }
  return Localization.getLocales()[0].languageCode || 'en';
}

const config: InitOptions = {
  resources: {
    en: { translation: en },
    es: { translation: es }
  },
  lng: getLang(), // Use device language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
}

i18n.use(initReactI18next).init(config);

export default i18n; 