import { faChartSimple, faClipboardList, faGear } from '@fortawesome/free-solid-svg-icons';
import { FC, useContext } from 'react';
import { role } from '../../../constants/constants';
import { AuthContext } from '../../../contexts/authContext';
import SidebarFooter from './SidebarFooter';
import SidebarNav from './SidebarNav';
import SidebarUserSection from './SidebarUserSection';
import { Role } from '../../../models/Role';

const navItems = [
  {
    to: '/',
    icon: faChartSimple,
    labelKey: 'dashboard',
    roles: [],
  },
  {
    to: '/inspections',
    icon: faClipboardList,
    labelKey: 'inspections',
    roles: [role.inspector, role.admin, role.owner],
  },
  {
    to: '/administration',
    icon: faGear,
    labelKey: 'administration',
    roles: [role.admin, role.owner],
  },
];

interface SidebarProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const Sidebar: FC<SidebarProps> = ({ expanded, setExpanded }) => {
  const { user, logout } = useContext(AuthContext);

  const userRoles = user?.roles?.map((r: Role) => r.name) || [];

  const sidebarWidth = expanded ? 'w-52' : 'w-16';
  const transition = 'transition-all duration-300';

  return (
    <div
      className={`fixed top-0 left-0 h-screen flex flex-col bg-primary ${sidebarWidth} ${transition} z-20`}
      style={{ minWidth: expanded ? '13rem' : '4rem' }}
    >
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

export default Sidebar;
