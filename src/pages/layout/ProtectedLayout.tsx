import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';

const ProtectedLayout = () => {
  return (
    <>
      <Sidebar />
        <div className="flex-1 min-h-screen bg-gray-100 pb-20 md:pb-0 md:ml-16">
            <Outlet />
        </div>
    </>
  );
};

export default ProtectedLayout;
