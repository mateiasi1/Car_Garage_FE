// src/components/login/Login.tsx
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
                    <div className="flex items-center justify-center mb-8">
                        <img src={logo} alt="RoadReady Logo" className="h-14 w-14 mr-3" />
                        <span className="text-2xl font-bold font-heading text-primary">RoadReady</span>
                    </div>

                    {!selectBranch ? (
                        <>
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-text text-sm font-bold font-body mb-2">
                                    {t('usernameTitle')}
                                </label>
                                <input
                                    id="username"
                                    value={credentials.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary font-body"
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="password" className="block text-text text-sm font-bold font-body mb-2">
                                    {t('passwordTitle')}
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary font-body"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-6">
                                <label htmlFor="branch" className="block text-text text-sm font-bold font-body mb-2">
                                    {t('selectBranch')}
                                </label>
                                <select
                                    id="branch"
                                    value={selectedBranchId}
                                    onChange={(e) => setSelectedBranchId(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary font-body"
                                >
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={selectBranch && !selectedBranchId}
                        className={`w-full py-2 px-4 rounded font-bold font-heading text-primary-text bg-primary hover:bg-primary-hover cursor-pointer transition-colors ${
                            selectBranch && !selectedBranchId ? 'opacity-50 cursor-not-allowed bg-primary-disabled' : ''
                        }`}
                    >
                        {t('loginButton')}
                    </button>

                    <div className="mt-4 text-center text-sm text-gray-600 font-body">
                        {t('login.termsInfo.prefix')}{' '}
                        <Link
                            to="/terms"
                            target="_blank"
                            className="text-primary hover:text-primary-hover font-medium underline"
                        >
                            {t('login.termsInfo.link')}
                        </Link>
                    </div>
                </form>
            </div>

            <div className="hidden md:flex md:w-3/5 items-center justify-center bg-[#7FADF1]">
                <img src={wallpaper} alt="Login Wallpaper" className="max-h-[80%] max-w-[80%] object-contain" />
            </div>
        </div>
    );
};

export default Login;
