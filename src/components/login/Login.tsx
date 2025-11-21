import React, { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import wallpaper from '../../assets/login_wallpaper.jpg';
import logo from '../../assets/logo.png';
import { routes } from '../../constants/routes';
import { AuthContext } from '../../contexts/authContext';
import { Credentials } from '../../models/Credentials';
import { useLoginMutation } from '../../rtk/services/auth-service';
import { showToast } from '../../utils/showToast';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { CustomSelect } from '../shared/CustomSelect';

const Login: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useContext(AuthContext);
  const [loginMutation] = useLoginMutation();

  const [credentials, setCredentials] = useState<Credentials>({ username: '', password: '' });

  const [selectBranch, setSelectBranch] = useState(false);
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const isAdmin = user.roles?.some((r) => r.name === 'ADMIN');
    navigate(isAdmin ? routes.ADMINISTRATION : routes.INSPECTIONS);
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (selectBranch && branches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branches[0].id);
    }
  }, [selectBranch, branches, selectedBranchId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCredentials((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) return;

    try {
      const payload =
        selectBranch && selectedBranchId
          ? {
              ...credentials,
              branchId: selectedBranchId,
            }
          : {
              ...credentials,
            };

      const data = await loginMutation(payload).unwrap();

      if (data.selectBranch && data.branches) {
        setSelectBranch(true);
        setBranches(data.branches);
        return;
      }

      if (data.accessToken) {
        login({ accessToken: data.accessToken });
      } else {
        showToast(t('wrongCredentials'), 'error');
      }
    } catch (error) {
      showToast(t('wrongCredentials'), 'error');
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="w-full md:w-2/5 flex items-center justify-center bg-card">
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-card px-8 pt-8 pb-8">
          <div className="flex items-center justify-center mb-8 cursor-pointer" onClick={() => navigate(routes.HOME)}>
            <img src={logo} alt="RoadReady Logo" className="h-14 w-14 mr-3" />
            <span className="text-2xl font-bold font-heading text-primary">RoadReady</span>
          </div>

          {!selectBranch ? (
            <>
              <Input
                label={t('usernameTitle')}
                id="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="john@example.com"
                autoComplete="username"
              />
              <Input
                label={t('passwordTitle')}
                type="password"
                id="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="•••••••"
                autoComplete="password"
              />
            </>
          ) : (
            <CustomSelect
              label={t('selectBranch')}
              value={selectedBranchId}
              onChange={(val) => setSelectedBranchId(val)}
              options={branches.map((branch) => ({
                value: branch.id,
                label: branch.name,
              }))}
            />
          )}

          <Button type="submit" fullWidth disabled={selectBranch && !selectedBranchId} variant="primary">
            {t('loginButton')}
          </Button>

          <div className="mt-4 text-center text-sm text-gray-600 font-body">
            {t('login.termsInfo.prefix')}{' '}
            <Link to="/terms" target="_blank" className="text-primary hover:text-primary-hover font-medium underline">
              {t('login.termsInfo.link')}
            </Link>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600 font-body">{t('registerButton')} </div>
        </form>
      </div>

      <div className="hidden md:flex md:w-3/5 items-center justify-center bg-[#7FADF1]">
        <img src={wallpaper} alt="Login Wallpaper" className="max-h-[80%] max-w-[80%] object-contain" />
      </div>
    </div>
  );
};

export default Login;
