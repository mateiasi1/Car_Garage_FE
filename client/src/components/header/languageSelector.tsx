import { useState } from "react";
import { useTranslation } from "react-i18next";

// Import flag images
import flagEn from '../../assets/images/flag-en.png'; // Adjust the path as necessary
import flagRo from '../../assets/images/flag-ro.png'; // Adjust the path as necessary

const LanguageSelector = () => {
    const { i18n: { changeLanguage, language } } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(language);

    const handleChangeLanguage = () => {
        const newLanguage = currentLanguage === "en" ? "ro" : "en";
        setCurrentLanguage(newLanguage);
        changeLanguage(newLanguage);
    }

    return (
        <button 
            type="button" 
            onClick={handleChangeLanguage}
            className="flex items-center"
        >
            <img 
                src={currentLanguage === "en" ? flagEn : flagRo} 
                alt={currentLanguage === "en" ? "English flag" : "Romanian flag"} 
                className="w-6 h-6 mr-2" // Adjust the size as necessary
            />
            {currentLanguage === "en" ? "EN" : "RO"}
        </button>
    );
}

export default LanguageSelector;
