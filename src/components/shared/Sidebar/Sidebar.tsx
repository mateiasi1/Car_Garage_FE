import { faChartSimple, faClipboardList, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { FC, useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/authContext';
import SidebarFooter from './SidebarFooter';
import SidebarNav from './SidebarNav';
import SidebarUserSection from './SidebarUserSection';

const navItems = [
  {
    to: '/',
    icon: faChartSimple,
    labelKey: 'Dashboard',
    roles: [],
  },
  {
    to: '/inspections/upcoming',
    icon: faClipboardList,
    labelKey: 'Inspections',
    roles: ['INSPECTOR', 'ADMIN', 'OWNER'],
  },
  {
    to: '/administration',
    icon: faUserShield,
    labelKey: 'Administration',
    roles: ['ADMIN', 'OWNER'],
  },
];

const LeftPanel: FC = () => {
  const [expanded, setExpanded] = useState(true);
  const { user, logout } = useContext(AuthContext);

  const userRoles = user?.roles?.map((r) => r.name) || [];

  const sidebarWidth = expanded ? 'w-56' : 'w-20';
  const transition = 'transition-all duration-300';

  return (
    <div className={`h-screen flex flex-col bg-primary ${sidebarWidth} ${transition} relative`}>
      <SidebarUserSection expanded={expanded} user={user} />
      <SidebarNav expanded={expanded} navItems={navItems} userRoles={userRoles} />
      <SidebarFooter
        expanded={expanded}
        onLogout={logout}
        onExpand={() => setExpanded(true)}
        onCollapse={() => setExpanded(false)}
      />
    </div>
  );
};

export default LeftPanel;
