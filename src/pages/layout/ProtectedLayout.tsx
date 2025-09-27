import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar/Sidebar';

const ProtectedLayout = () => {
  const [expanded, setExpanded] = useState(false);

  const sidebarWidth = expanded ? '13rem' : '4rem';

  return (
    <>
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div className="flex-1 min-h-screen bg-gray-100 transition-all duration-300" style={{ marginLeft: sidebarWidth }}>
        <Outlet />
      </div>
    </>
  );
};

export default ProtectedLayout;
