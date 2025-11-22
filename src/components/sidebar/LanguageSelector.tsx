import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import flagEn from '../../assets/images/flag-en.png';
import flagRo from '../../assets/images/flag-ro.png';
import { Button } from '../shared/Button';

const LanguageSelector = () => {
  const {
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'ro' : 'en';
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  const isEn = currentLanguage === 'en';

  return (
    <Button
      type="button"
      onClick={handleChangeLanguage}
      variant="secondary"
      size="sm"
      className="flex items-center justify-center gap-2 rounded-xl px-3 py-2 w-full"
    >
      <img src={isEn ? flagEn : flagRo} alt={isEn ? 'EN' : 'RO'} className="w-5 h-5 rounded-sm" />
      <span className="font-body font-medium text-sm">{isEn ? 'EN' : 'RO'}</span>
    </Button>
  );
};

export default LanguageSelector;
