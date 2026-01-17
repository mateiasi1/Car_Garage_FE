import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/shared/Button';
import { Logo } from '../../components/shared/Logo';
import SEO from '../../components/shared/SEO';

const REDIRECT_SECONDS = 5;

const NotFoundPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/inspections');
    }, REDIRECT_SECONDS * 1000);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <>
      <SEO
        title="404 - Pagina nu a fost găsită | RoadReady"
        description="Pagina pe care o căutați nu există."
        noIndex={true}
      />
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md mx-auto bg-surface rounded-xl border border-border px-8 py-10 text-center space-y-6">
          <Logo />

        <div className="space-y-2">
          <h1 className="text-6xl font-heading font-bold text-primary">404</h1>
          <h2 className="text-2xl font-heading text-text">{t('pageNotFound')}</h2>
        </div>

        <p className="text-sm text-muted font-body">{t('pageNotFoundDescription')}</p>

        <p className="text-xs text-muted font-body">
          {t('backToInspections')} <span className="font-semibold text-primary">({secondsLeft}s)</span>
        </p>

        <div className="pt-2">
          <Button type="button" variant="primary" size="md" className="w-full" onClick={() => navigate('/inspections')}>
            {t('backToInspections')}
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};

export default NotFoundPage;
