import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import {IconProp} from "@fortawesome/fontawesome-svg-core";

interface NavItem {
  to: string;
  icon: IconProp;
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
    <nav className={`flex-1 flex flex-col ${expanded ? 'items-start mt-32' : 'items-center mt-32'} w-full`}>
      {filteredNavItems.map((item) => {
        const isActive = location.pathname === item.to;
        const linkActiveBox = expanded && isActive ? 'bg-activeMenu rounded-md' : '';
        const iconActiveBox = !expanded && isActive ? 'bg-activeMenu rounded-md' : '';

        return (
          <Link
            key={item.to}
            to={item.to}
            className={`
              flex items-center
              ${expanded ? 'py-1 w-[92%] px-2 justify-start mx-auto' : 'justify-center py-1 w-12'}
              ${linkActiveBox}
              mb-3
            `}
            style={{ minWidth: expanded ? '0' : '48px' }}
          >
            <span
              className={`
                flex items-center justify-center
                ${expanded ? 'w-10 h-10' : `w-10 h-10 ${iconActiveBox}`}
              `}
            >
              <FontAwesomeIcon icon={item.icon} className={`text-xl ${isActive ? 'text-primary' : 'text-white'}`} />
            </span>
            <div
              className={`
                overflow-hidden
                ${expanded ? 'w-32 opacity-100 ml-1' : 'w-0 opacity-0 ml-0'}
              `}
            >
              {expanded && (
                <span className={`text-base ${isActive ? 'text-primary' : 'text-gray-300'}`}>{t(item.labelKey)}</span>
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default SidebarNav;
