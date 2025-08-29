import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationNB from "../locales/nb-NO/translation.json";
import translationSE from "../locales/sv-SE/translation.json";

// the translations
const resources = {
  "nb-NO": {
    translation: translationNB,
  },
  "sv-SE": {
    translation: translationSE,
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem("editor_language") || "en-US",
    nsSeparator: false, // allow colon in strings (language file is flat JSON)
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
