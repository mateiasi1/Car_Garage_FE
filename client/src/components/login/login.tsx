import React, { FC, useContext, useState } from 'react';
import { useMutation } from 'react-query';
import { loginQuery } from '../../../api/queries/login';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';
import { AuthContext } from '../../contexts/authContext';

type LoginCredentials = {
    email: string;
    password: string;
    recaptchaToken: string;
};

const Login: FC = () => {
    const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '', recaptchaToken: '' });
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const { t } = useTranslation();
    const RECAPTCHA_SECRET_KEY = import.meta.env.VITE_RECAPTCHA_SECRET_KEY || '';
    const { isAuthenticated, login, logout } = useContext(AuthContext);

    const { i18n: {  language } } = useTranslation();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setCredentials(prevState => ({ ...prevState, [id]: value }));
    };

    const handleRecaptchaChange = (token: string | null) => {
        setRecaptchaToken(token);

    };

    const showToast = (message: string, type: 'error' | 'success') => {
        toast[type](message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const mutation = useMutation(loginQuery, {
        onError: (error: Error) => {showToast(error.message, 'error') },
        onSuccess: (data) => {
            login();
            showToast(t('loginSuccess'), 'success');
            localStorage.setItem('token', data.access_token);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.email)) {
            showToast(t('invalidEmail'), 'error');
            return;
        }

        if (!credentials.password) {
            showToast(t('passwordEmpty'), 'error');
            return;
        }

        if (!recaptchaToken) {
            showToast(t('recaptchaTitle'), 'error');
            return;
        }

        mutation.mutate({ ...credentials, recaptchaToken });
    };

    
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white px-8 pt-6 pb-8 mb-4 max-w-sm w-full">
                <h2 className="text-2xl font-bold mb-4 text-center">{t('loginTitle')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">{t('emailTitle')}:</label>
                        <input
                            type="email"
                            id="email"
                            value={credentials.email}
                            onChange={handleChange}
                            className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">{t('passwordTitle')}:</label>
                        <input
                            type="password"
                            id="password"
                            value={credentials.password}
                            onChange={handleChange}
                            className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <ReCAPTCHA
                        sitekey={RECAPTCHA_SECRET_KEY || ""}
                        onChange={handleRecaptchaChange}
                        hl={language}
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">{t('loginButton')}</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
