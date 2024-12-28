import React from 'react';
import Footer from './footer/footer';
import HeaderPage from './header/headerPage';
import LeftPanel from '../../components/shared/LeftPanel';

interface LayoutProps {
    children: React.ReactNode;
    isPanelDisplayed?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isPanelDisplayed=true }) => {

    return (
        <div>
            <HeaderPage/>
            {isPanelDisplayed && <LeftPanel />}
            <div className="mt-14 ml-20 min-h-screen">
                {children}
            </div>
            <Footer/>
        </div>
    );
};

export default Layout;