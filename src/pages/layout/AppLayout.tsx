import { Outlet } from 'react-router-dom';
import LanguageSelector from '../../components/header/LanguageSelector';

const AppLayout = () => (
  <div className="relative min-h-screen w-full">
    <div className="absolute top-6 right-8 z-10">
      <LanguageSelector />
    </div>
    <div className="flex min-h-screen w-full">
      <Outlet />
    </div>
  </div>
);

export default AppLayout;
