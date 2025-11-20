import { faClipboardList, faGear } from '@fortawesome/free-solid-svg-icons';
import { FC, useContext } from 'react';
import { AuthContext } from '../../contexts/authContext.tsx';
import { Role as RoleModel } from '../../models/Role.ts';
import { Role } from '../../utils/enums/Role.ts';
import SidebarFooter from './SidebarFooter.tsx';
import SidebarNav from './SidebarNav.tsx';
import SidebarUserSection from './SidebarUserSection.tsx';
import LanguageSelector from "./LanguageSelector.tsx";

const navItems = [
  // {
  //   to: '/',
  //   icon: faChartSimple,
  //   labelKey: 'dashboard',
  //   roles: [Role.admin, Role.owner],
  // },
  {
    to: '/inspections',
    icon: faClipboardList,
    labelKey: 'inspections',
    roles: [Role.inspector, Role.owner],
  },
  {
    to: '/administration',
    icon: faGear,
    labelKey: 'administration',
    roles: [Role.admin, Role.owner, Role.inspector],
  },
];

interface SidebarProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const Sidebar: FC<SidebarProps> = ({ expanded, setExpanded }) => {
  const { user, logout } = useContext(AuthContext);
  const userRoles = user?.roles?.map((r: RoleModel) => r.name) || [];

  const sidebarWidth = expanded ? 'w-52' : 'w-16';
  const transition = 'transition-all duration-300';

  return (
    <div
      className={`fixed top-0 left-0 h-screen flex flex-col bg-primary ${sidebarWidth} ${transition} z-20`}
      style={{ minWidth: expanded ? '13rem' : '4rem' }}
    >
      <SidebarUserSection expanded={expanded} user={user} />
      <LanguageSelector />
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
