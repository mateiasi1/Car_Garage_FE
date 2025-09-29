import React, { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, useNavigate } from 'react-router-dom';
import wallpaper from '../../assets/login_wallpaper.jpg';
import logo from '../../assets/logo.png';
import { routes } from '../../constants/routes';
import { AuthContext } from '../../contexts/authContext';
import { Credentials } from '../../models/Credentials';
import { useLoginMutation } from '../../rtk/services/auth-service';
import { showToast } from '../../utils/showToast';

const Login: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);
  const [loginMutation] = useLoginMutation();
  const [credentials, setCredentials] = useState<Credentials>({ username: '', password: '' });
  const [selectCompany, setSelectCompany] = useState(false);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.INSPECTIONS);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (selectCompany && companies.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(companies[0].id);
    }
  }, [selectCompany, companies, selectedCompanyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCredentials((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) return;

    try {
      const payload = {
        ...credentials,
        companyId: selectedCompanyId || undefined,
      };

      const data = await loginMutation(payload).unwrap();

      if (data.selectCompany && data.companies) {
        setSelectCompany(true);
        setCompanies(data.companies);
        return;
      }

      login({ accessToken: data.accessToken!, refreshToken: data.refreshToken! });
      navigate(routes.INSPECTIONS);
    } catch (error) {
      showToast(t('wrongCredentials'), 'error');
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="w-full md:w-2/5 flex items-center justify-center bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white px-8 pt-8 pb-8">
          <div className="flex items-center justify-center mb-8">
            <img src={logo} alt="RoadReady Logo" className="h-14 w-14 mr-3" />
            <span className="text-2xl font-bold text-primary">RoadReady</span>
          </div>

          {!selectCompany ? (
            <>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                  {t('usernameTitle')}
                </label>
                <input
                  id="username"
                  value={credentials.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                  {t('passwordTitle')}
                </label>
                <input
                  type="password"
                  id="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:outline-none"
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <label htmlFor="company" className="block text-gray-700 text-sm font-bold mb-2">
                  {t('selectCompany')}
                </label>
                <select
                  id="company"
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:outline-none"
                >
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={selectCompany && !selectedCompanyId}
            className={`w-full py-2 px-4 rounded font-bold text-white bg-primary hover:bg-primary-hover cursor-pointer transition-colors ${
              selectCompany && !selectedCompanyId ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {t('loginButton')}
          </button>
        </form>
      </div>

      <div className="hidden md:flex md:w-3/5 items-center justify-center bg-[#7FADF1]">
        <img src={wallpaper} alt="Login Wallpaper" className="max-h-[80%] max-w-[80%] object-contain" />
      </div>
    </div>
  );
};

export default Login;
