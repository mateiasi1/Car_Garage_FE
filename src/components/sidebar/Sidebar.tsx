import { FC, useState } from 'react';
import { ClipboardList, Settings, Power, Menu } from 'lucide-react';
import { Role as RoleEnum } from '../../utils/enums/Role';
import SidebarNav, { NavItem } from './SidebarNav';
import LanguageSelector from './LanguageSelector';
import { routes } from '../../constants/routes';
import { IconButton } from '../shared/IconButton';
import { useAuth } from '../../hooks/useAuth';
import { useUserRoles } from '../../hooks/useUserRoles';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const navItems: NavItem[] = [
  {
    to: routes.INSPECTIONS,
    icon: ClipboardList,
    labelKey: 'inspections',
    roles: [RoleEnum.inspector, RoleEnum.owner],
  },
  {
    to: routes.ADMINISTRATION_SHORT,
    icon: Settings,
    labelKey: 'administration',
    roles: [RoleEnum.admin, RoleEnum.owner, RoleEnum.inspector],
  },
];

const Sidebar: FC = () => {
  const { user, logout } = useAuth();
  const { roles: userRoles } = useUserRoles();
  const [menuOpen, setMenuOpen] = useState(false);

  const isCompactMobile = useMediaQuery('(max-width: 450px)');

  const initials = `${user?.firstName?.charAt(0) ?? ''}${user?.lastName?.charAt(0) ?? ''}`.toUpperCase() || '??';

  return (
    <>
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-16 flex-col items-center bg-primary text-primary-text py-4 z-20 shadow-2xl shadow-black/20">
        <div className="w-10 h-10 rounded-full bg-card text-primary flex items-center justify-center font-bold text-lg shadow-md">
          {initials}
        </div>

        <div className="mt-4 scale-90">
          <LanguageSelector />
        </div>

        <SidebarNav navItems={navItems} userRoles={userRoles} variant="vertical" />

        <div className="mt-auto mb-3">
          <IconButton onClick={logout} aria-label="Logout" variant="dangerGhost" size="md">
            <Power className="w-5 h-5" />
          </IconButton>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary text-primary-text flex items-center px-4 py-3 z-50 shadow-2xl shadow-black/25">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-card text-primary flex items-center justify-center font-bold text-sm shadow-md">
            {initials}
          </div>
          <div className="scale-90">
            <LanguageSelector />
          </div>
        </div>

        {!isCompactMobile && (
          <>
            <div className="absolute left-1/2 -translate-x-1/2">
              <SidebarNav navItems={navItems} userRoles={userRoles} variant="bottom" colorMode="onPrimary" />
            </div>

            <div className="ml-auto">
              <IconButton onClick={logout} aria-label="Logout" variant="dangerGhost" size="sm">
                <Power className="w-4 h-4" />
              </IconButton>
            </div>
          </>
        )}

        {isCompactMobile && (
          <div className="ml-auto relative">
            <IconButton
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Open navigation menu"
              variant="ghost"
              size="sm"
            >
              <Menu className="w-4 h-4" />
            </IconButton>

            {menuOpen && (
              <div className="absolute bottom-12 right-0 z-50">
                <div className="bg-card text-text rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-4 border border-card/40">
                  <SidebarNav navItems={navItems} userRoles={userRoles} variant="bottom" colorMode="onCard" />

                  <IconButton
                    onClick={logout}
                    aria-label="Logout"
                    variant="dangerGhost"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    <Power className="w-4 h-4" />
                  </IconButton>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
