import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useUnsubscribeMutation } from '../../rtk/services/customer-service';
import { PageContainer } from '../shared/PageContainer';
import { CustomText } from '../shared/CustomText';
import { Logo } from '../shared/Logo';

type UnsubscribeState = 'loading' | 'success' | 'error' | 'already-unsubscribed';

const Unsubscribe: FC = () => {
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
        const response = await unsubscribeMutation({ token }).unwrap();

        if (response.alreadyUnsubscribed) {
          setState('already-unsubscribed');
        } else {
          setState('success');
        }
      } catch {
        setState('error');
        setErrorMessage(t('unsubscribe.genericError'));
      }
    };

    void handleUnsubscribe();
  }, [searchParams, unsubscribeMutation, t]);

  const renderContent = () => {
    if (state === 'loading') {
      return (
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary/30 border-t-primary mx-auto" />
          <CustomText variant="h3" className="text-text">
            {t('unsubscribe.processing')}
          </CustomText>
          <CustomText variant="body" className="text-text/70">
            {t('unsubscribe.pleaseWait')}
          </CustomText>
        </div>
      );
    }

    if (state === 'success') {
      return (
        <div className="text-center space-y-4">
          <div className="mx-auto mb-2 h-16 w-16 text-green-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <CustomText variant="h3" className="text-text">
            {t('unsubscribe.successTitle')}
          </CustomText>

          <CustomText variant="body" className="text-text/70">
            {t('unsubscribe.successMessage')}
          </CustomText>

          <CustomText variant="muted">{t('unsubscribe.successNote')}</CustomText>
        </div>
      );
    }

    if (state === 'already-unsubscribed') {
      return (
        <div className="text-center space-y-4">
          <div className="mx-auto mb-2 h-16 w-16 text-blue-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <CustomText variant="h3" className="text-text">
            {t('unsubscribe.alreadyUnsubscribedTitle')}
          </CustomText>

          <CustomText variant="body" className="text-text/70">
            {t('unsubscribe.alreadyUnsubscribedMessage')}
          </CustomText>
        </div>
      );
    }

    // error
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto mb-2 h-16 w-16 text-red-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <CustomText variant="h3" className="text-text">
          {t('unsubscribe.errorTitle')}
        </CustomText>

        <CustomText variant="body" className="text-text/70">
          {errorMessage}
        </CustomText>

        <CustomText variant="muted">{t('unsubscribe.errorNote')}</CustomText>
      </div>
    );
  };

  return (
    <PageContainer>
      <div className="w-full max-w-xl mx-auto bg-card rounded-3xl shadow-lg border border-text/10 px-8 py-10 space-y-8">
        <Logo />
        {renderContent()}
      </div>
    </PageContainer>
  );
};

export default Unsubscribe;
