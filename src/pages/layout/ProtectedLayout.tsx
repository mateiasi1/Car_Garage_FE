import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import DemoBanner from '../../components/shared/DemoBanner';

const ProtectedLayout = () => {
  return (
    <div className="min-h-screen w-full bg-page-gradient flex">
      <Sidebar />

      <div className="flex-1 min-h-screen pb-20 md:pb-0 md:ml-16 flex flex-col">
        <div className="px-4 pt-4">
          <DemoBanner />
        </div>
        <main className="flex-1 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
