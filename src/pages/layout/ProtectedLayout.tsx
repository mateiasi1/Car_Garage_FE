import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar/Sidebar';

const ProtectedLayout = () => (
  <div className="flex h-screen">
    <Sidebar />
    <div className="flex-1">
      <Outlet />
    </div>
  </div>
);

export default ProtectedLayout;
