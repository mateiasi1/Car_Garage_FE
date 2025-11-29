import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';

const ProtectedLayout = () => {
  return (
    <div className="min-h-screen w-full bg-background flex">
      <Sidebar />

      <div className="flex-1 min-h-screen pb-20 md:pb-0 md:ml-16 flex">
        <main className="flex-1 bg-background overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
