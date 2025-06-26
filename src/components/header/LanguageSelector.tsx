import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import flagEn from '../../assets/images/flag-en.png';
import flagRo from '../../assets/images/flag-ro.png';

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

  return (
    <button type="button" onClick={handleChangeLanguage} className="flex items-center">
      <img
        src={currentLanguage === 'en' ? flagEn : flagRo}
        alt={currentLanguage === 'en' ? 'English flag' : 'Romanian flag'}
        className="w-6 h-6 mr-2"
      />
      {currentLanguage === 'en' ? 'EN' : 'RO'}
    </button>
  );
};

export default LanguageSelector;
