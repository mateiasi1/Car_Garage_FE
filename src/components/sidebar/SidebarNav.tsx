import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  icon: LucideIcon;
  labelKey: string;
  roles?: string[];
}

interface SidebarNavProps {
  navItems: NavItem[];
  userRoles: string[];
  variant: 'vertical' | 'bottom';
  colorMode?: 'onPrimary' | 'onCard'; // 👈 nou
}

const SidebarNav: FC<SidebarNavProps> = ({
  navItems,
  userRoles,
  variant,
  colorMode = 'onPrimary', // default = alb (pentru bara de jos)
}) => {
  const location = useLocation();

  const filtered = navItems.filter(
    (item) => !item.roles?.length || item.roles.some((role) => userRoles.includes(role))
  );

  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(to + '/');

  if (variant === 'vertical') {
    return (
      <nav className="mt-8 flex flex-col items-center gap-4 w-full">
        {filtered.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);

          return (
            <Link key={item.to} to={item.to} className="w-12 h-12 flex items-center justify-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  active ? 'bg-card text-primary' : 'bg-transparent text-primary-text'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </Link>
          );
        })}
      </nav>
    );
  }

  const inactiveColor = colorMode === 'onPrimary' ? 'text-primary-text' : 'text-text';

  return (
    <nav className="flex justify-center gap-4">
      {filtered.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.to);

        return (
          <Link key={item.to} to={item.to} className="w-9 h-9 flex items-center justify-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                active ? 'bg-activeMenu text-primary' : `bg-transparent ${inactiveColor}`
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default SidebarNav;
