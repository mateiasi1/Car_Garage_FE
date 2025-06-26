import React from 'react';
import Footer from './footer/footer';
import HeaderPage from './header/headerPage';
import LeftPanel from '../../components/shared/LeftPanel';

interface LayoutProps {
  children: React.ReactNode;
  isPanelDisplayed?: boolean;
  isHeaderDisplayed?: boolean;
  isFooterDisplayed?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  isPanelDisplayed = true,
  isHeaderDisplayed = true,
  isFooterDisplayed = true,
}) => {
  return (
    <>
      {isHeaderDisplayed && <HeaderPage />}
      {isPanelDisplayed && <LeftPanel />}
      <div className="min-h-screen">{children}</div>
      {isFooterDisplayed && <Footer />}
    </>
  );
};

export default Layout;
