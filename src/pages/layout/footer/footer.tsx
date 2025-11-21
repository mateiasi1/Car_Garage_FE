import { FC } from 'react';
import { brandName } from '../../../constants/constants';

const Footer: FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-sidebar text-primary-text border-t border-card/10 h-14 flex items-center z-20">
      <div className="max-w-7xl mx-auto px-4 w-full flex justify-center items-center">
        <p className="text-xs sm:text-sm font-body text-primary-text/80 text-center">
          © {year} {brandName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
