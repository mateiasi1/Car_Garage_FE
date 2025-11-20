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
        <button
            type="button"
            onClick={handleChangeLanguage}
            className="
        flex items-center justify-center gap-2
        bg-gray-200 hover:bg-gray-300
        rounded-md px-3 py-2
        text-text font-body text-sm
        shadow-sm transition
        w-full
      "
        >
            <img
                src={currentLanguage === 'en' ? flagEn : flagRo}
                alt={currentLanguage === 'en' ? 'EN' : 'RO'}
                className="w-5 h-5"
            />
            <span className="font-medium">
        {currentLanguage === 'en' ? 'EN' : 'RO'}
      </span>
        </button>
    );
};

export default LanguageSelector;
