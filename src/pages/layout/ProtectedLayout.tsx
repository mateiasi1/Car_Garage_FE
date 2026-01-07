import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import DemoBanner from '../../components/shared/DemoBanner';

const ProtectedLayout = () => {
  return (
    <div className="h-screen lg:min-h-screen w-full bg-page-gradient flex overflow-hidden lg:overflow-visible">
      <Sidebar />

      <div className="flex-1 h-full lg:min-h-screen pb-20 md:pb-0 md:ml-16 flex flex-col">
        <div className="px-4 pt-4 flex-shrink-0">
          <DemoBanner />
        </div>
        <main className="flex-1 overflow-y-auto lg:overflow-x-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
