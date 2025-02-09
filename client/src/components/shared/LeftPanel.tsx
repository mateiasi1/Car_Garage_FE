import { FC, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { AuthContext } from "../../contexts/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const LeftPanel: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  const toggleNavbar = () => {
    console.log('Toggling navbar');
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Expanded/Collapsed Navbar */}
      <div className={`fixed top-14 pb-[100px] w-64 h-[calc(100vh-14px)] bg-gray-800 text-white flex flex-col ${isOpen ? 'block' : 'hidden'}`}>
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-lg font-semibold">{t('controlPanel')}</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
        <Link to="/home" className="block py-2 px-4 rounded hover:bg-gray-700">{t('dashboard')}</Link>
          <Link to="/customer/list" className="block py-2 px-4 rounded hover:bg-gray-700">{t('addNewCustomer')}</Link>
          <Link to="/users/add-new" className="block py-2 px-4 rounded hover:bg-gray-700">{t('addNewUser')}</Link>

          <Link to="/profile" className="block py-2 px-4 rounded hover:bg-gray-700">{t('profile')}</Link>
          <Link to="/settings" className="block py-2 px-4 rounded hover:bg-gray-700">{t('settings')}</Link>
          <Link to="/reports" className={`block py-2 px-4 rounded `}>{t('reports')}</Link>
         
          {isAuthenticated ? (
            <a href="/login" onClick={handleLogout} className="block py-2 px-4 rounded hover:bg-gray-700">
              {t('logout')}&nbsp;&nbsp;<FontAwesomeIcon icon={faSignOutAlt} className="text-white hover:text-black" size="sm" />
            </a>
          ) : (
            <a href="/login" onClick={handleLogin} className="block py-2 px-4 rounded hover:bg-gray-700">
              {t('loginButton')}&nbsp;&nbsp;<FontAwesomeIcon icon={faSignInAlt} className="text-white hover:text-black" size="sm" />
            </a>
          )}
        </nav>
        <div className="p-4 cursor-pointer" onClick={toggleNavbar}>
          <FaAngleDoubleLeft className="text-white" size={30} />
        </div>
      </div>
      {isOpen && <div className="fixed top-14 left-64 w-[calc(100vw-64px)] h-[calc(100vh-14px)] bg-black bg-opacity-50 z-10 pointer-events-auto" onClick={toggleNavbar}></div>}
      {/* Trigger to toggle navbar */}
      <div className={`fixed top-14 pb-[100px] w-15 h-[calc(100vh-14px)] bg-gray-800 text-white flex flex-col ${isOpen ? 'hidden' : 'block'}`}>
        <div className="p-4 cursor-pointer" onClick={toggleNavbar}>
          <FaAngleDoubleRight className="text-white" size={30} />
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
