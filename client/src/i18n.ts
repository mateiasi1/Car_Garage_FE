import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import enJSON from './translations/en.json'
import roJson from './translations/ro.json'
i18n.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    ro: { ...roJson },
  },
  lng: "en",
});