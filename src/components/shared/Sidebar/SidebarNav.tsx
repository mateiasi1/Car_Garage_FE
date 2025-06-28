import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

interface NavItem {
  to: string;
  icon: any;
  labelKey: string;
  roles?: string[];
}

interface SidebarNavProps {
  expanded: boolean;
  navItems: NavItem[];
  userRoles: string[];
}

const SidebarNav: FC<SidebarNavProps> = ({ expanded, navItems, userRoles }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const filteredNavItems = navItems.filter(
    (item) => !item.roles?.length || item.roles.some((role: string) => userRoles.includes(role))
  );

  return (
    <nav className={`flex-1 flex flex-col ${expanded ? 'items-start mt-16 pl-4' : 'items-center mt-16'} w-full`}>
      {filteredNavItems.map((item) => {
        const isActive = location.pathname === item.to;
        // Active style for expanded/collapsed
        const activeBox = isActive ? 'bg-primary-hover rounded-md' : '';
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`
              flex items-center transition-all duration-300
              ${expanded ? 'gap-3 py-1 w-10/12 px-2 justify-start' : 'justify-center py-2 w-12'}
              mb-3
            `}
            style={{ minWidth: expanded ? '0' : '48px' }}
          >
            <span
              className={`
                flex items-center justify-center mt-1
                ${expanded ? `w-10 h-10 ${activeBox}` : `w-8 h-8 ${activeBox}`}
                transition-all duration-300
              `}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={`text-lg transition-all duration-300 ${isActive ? 'text-primary' : 'text-white'}`}
              />
            </span>
            {expanded && (
              <span
                className={`text-base transition-all duration-300 ml-2 ${isActive ? 'text-primary' : 'text-gray-300'}`}
              >
                {t(item.labelKey)}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default SidebarNav;
