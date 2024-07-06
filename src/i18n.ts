// src/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import zhTranslations from './locales/zh.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      zh: { translation: zhTranslations },
    },
    lng: 'en', // 默认语言
    fallbackLng: 'en', // 如果当前语言中没有翻译，使用英语
    interpolation: {
      escapeValue: false, // react已经安全地转义了
    },
  });

export default i18n;