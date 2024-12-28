import { FC, useContext } from "react";
import { brandName } from "../../constants/constants";
import LanguageSelector from "./languageSelector";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../contexts/authContext";

const Header: FC = () => {
    const { t } = useTranslation();
    const { isAuthenticated, login, logout } = useContext(AuthContext);

    const handleLogout = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        logout();
    };

    const handleLogin = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        login();
    };

    return (
        <nav className="fixed w-full top-0 border-b border-gray-300 h-14 flex items-center justify-between" style={{ background: 'linear-gradient(to right, #4CAF50, #2E7D32)' }}>
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-gray-100 text-xl font-bold">
                    {brandName}
                </div>
                <div className="flex items-center space-x-4">
                    <a href="#" className="text-gray-100 hover:text-black hidden md:inline">{t('home')}</a>
                    <a href="#" className="text-gray-100 hover:text-black hidden md:inline">{t('about')}</a>
                    <a href="#" className="text-gray-100 hover:text-black hidden md:inline">{t('services')}</a>
                    <a href="Add" className="text-gray-100 hover:text-black hidden md:inline">{t('contact')}</a>
                    <LanguageSelector />
                    {isAuthenticated ? (
                        <a href="login" onClick={handleLogout}>
                            <FontAwesomeIcon 
                                icon={faSignOutAlt} 
                                className="text-white hover:text-black" 
                                size="lg"
                            />
                        </a>
                    ) : (
                        <a href="login" onClick={handleLogin}>
                            <FontAwesomeIcon 
                                icon={faSignInAlt} 
                                className="text-white hover:text-black" 
                                size="lg"
                            />
                        </a>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
