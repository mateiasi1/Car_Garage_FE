import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useUnsubscribeMutation } from '../../rtk/services/customer-service';

type UnsubscribeState = 'loading' | 'success' | 'error' | 'already-unsubscribed';

const Unsubscribe = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [unsubscribeMutation] = useUnsubscribeMutation();

  const [state, setState] = useState<UnsubscribeState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const hasCalledUnsubscribe = useRef(false);

  useEffect(() => {
    if (hasCalledUnsubscribe.current) return;

    const token = searchParams.get('token');

    if (!token) {
      setState('error');
      setErrorMessage(t('unsubscribe.missingToken'));
      return;
    }

    hasCalledUnsubscribe.current = true;

    const handleUnsubscribe = async () => {
      try {
        setState('loading');

        const response = await unsubscribeMutation({ token }).unwrap();

        if (response.alreadyUnsubscribed) {
          setState('already-unsubscribed');
        } else {
          setState('success');
        }
      } catch (error) {
        setState('error');
        setErrorMessage(t('unsubscribe.genericError'));
      }
    };

    handleUnsubscribe();
  }, [searchParams, unsubscribeMutation]);

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('unsubscribe.processing')}</h2>
            <p className="text-gray-600">{t('unsubscribe.pleaseWait')}</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('unsubscribe.successTitle')}</h2>
            <p className="text-gray-600 mb-2">{t('unsubscribe.successMessage')}</p>
            <p className="text-sm text-gray-500">{t('unsubscribe.successNote')}</p>
          </div>
        );

      case 'already-unsubscribed':
        return (
          <div className="text-center">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('unsubscribe.alreadyUnsubscribedTitle')}</h2>
            <p className="text-gray-600">{t('unsubscribe.alreadyUnsubscribedMessage')}</p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('unsubscribe.errorTitle')}</h2>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <p className="text-sm text-gray-500">{t('unsubscribe.errorNote')}</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <div className="w-full max-w-2xl px-8 py-12">
        <div className="flex items-center justify-center mb-12">
          <img src={logo} alt="RoadReady Logo" className="h-16 w-16 mr-4" />
          <span className="text-3xl font-bold text-primary">RoadReady</span>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Unsubscribe;
