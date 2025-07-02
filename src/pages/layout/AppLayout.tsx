import { Outlet } from 'react-router-dom';
import LanguageSelector from '../../components/header/LanguageSelector';

const AppLayout = () => (
  <div className="relative min-h-screen">
    <div className="absolute top-6 right-8">
      <LanguageSelector />
    </div>
    <Outlet />
  </div>
);

export default AppLayout;