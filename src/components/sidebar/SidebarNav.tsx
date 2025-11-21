import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface NavItem {
  to: string;
  icon: IconProp;
  labelKey: string;
  roles?: string[];
}

interface SidebarNavProps {
  navItems: NavItem[];
  userRoles: string[];
  variant: 'vertical' | 'bottom';
}

const SidebarNav: FC<SidebarNavProps> = ({ navItems, userRoles, variant }) => {
  const location = useLocation();

  const filtered = navItems.filter(
    (item) => !item.roles?.length || item.roles.some((role) => userRoles.includes(role))
  );

  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(to + '/');

  if (variant === 'vertical') {
    return (
      <nav className="mt-8 flex flex-col items-center gap-4 w-full">
        {filtered.map((item) => (
          <Link key={item.to} to={item.to} className="w-12 h-12 flex items-center justify-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isActive(item.to) ? 'bg-white text-primary' : 'bg-transparent text-white'
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="text-xl" />
            </div>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex flex-1 justify-center gap-8">
      {filtered.map((item) => (
        <Link key={item.to} to={item.to} className="w-10 h-10 flex items-center justify-center">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center ${
              isActive(item.to) ? 'bg-activeMenu text-primary' : 'bg-transparent text-white'
            }`}
          >
            <FontAwesomeIcon icon={item.icon} className="text-lg" />
          </div>
        </Link>
      ))}
    </nav>
  );
};

export default SidebarNav;
