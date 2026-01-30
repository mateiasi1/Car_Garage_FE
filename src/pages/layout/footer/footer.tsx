import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { brandName } from '../../../constants/constants';

const Footer: FC = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-sidebar text-primary-text border-t border-card/10 h-14 flex items-center z-20">
      <div className="max-w-7xl mx-auto px-4 w-full flex justify-center items-center gap-4">
        <p className="text-xs sm:text-sm font-body text-primary-text/80 text-center">
          © {year} {brandName}. All rights reserved.
        </p>
        <a href="https://anpc.ro/" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm font-body text-primary-text/80 hover:text-primary-text transition-colors">
          {t('home.footer.anpc')}
        </a>
        <a href="https://consumer-redress.ec.europa.eu/index_en" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm font-body text-primary-text/80 hover:text-primary-text transition-colors">
          {t('home.footer.odr')}
        </a>
      </div>
    </footer>
  );
};

export default Footer;
