import i18n, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from '@/translations/en';
import es from '@/translations/es';

const config: InitOptions = {
  resources: {
    en: { translation: en },
    es: { translation: es }
  },
  lng: Localization.getLocales()[0].languageCode || 'en', // Use device language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
};

i18n.use(initReactI18next).init(config);

export default i18n; 