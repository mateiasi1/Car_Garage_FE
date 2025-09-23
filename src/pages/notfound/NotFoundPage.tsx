import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../components/shared/PrimaryButton';

const NotFoundPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/inspections');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);
  // TODO: Fix language switching to RO for some reason when this page comes up. It does not respect selected language
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-heading">{t('pageNotFound')}</h2>
        <p className="text-gray-600">{t('pageNotFoundDescription')}</p>
        <div className="pt-4">
          <PrimaryButton text={t('backToInspections')} onClick={() => navigate('/inspections')} />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
