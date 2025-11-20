import { Outlet } from 'react-router-dom';

const AppLayout = () => (
  <div className="relative min-h-screen w-full">
    <div className="flex min-h-screen w-full">
      <Outlet />
    </div>
  </div>
);

export default AppLayout;
