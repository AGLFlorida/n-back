import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { Platform } from 'react-native';
import log from './logger';

import en from '@/assets/translations/en';
import es from '@/assets/translations/es';

const getLang = () => {
  try {
    if (Platform.OS === "web") {
      return navigator.language;
    }
    const locale = Localization.getLocales()[0].languageCode;
    return locale || 'en';
  } catch (e) {
    log.warn("Error getting locale, defaulting to en:", e);
    return 'en';
  }
}

const resources = {
  en: { translation: en },
  es: { translation: es }
};

// Initialize synchronously
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLang(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    debug: false,
    initImmediate: false
  });

export default i18n; 