import { FC, useState } from 'react';
import { Car, LayoutDashboard, Power, Menu, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LanguageSelector from '../sidebar/LanguageSelector';
import { routes } from '../../constants/routes';
import { IconButton } from '../shared/IconButton';
import { customerSession } from '../../utils/customerSession';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  icon: LucideIcon;
  labelKey: string;
}

const navItems: NavItem[] = [
  {
    to: routes.CUSTOMER_DASHBOARD,
    icon: LayoutDashboard,
    labelKey: 'customer.nav.dashboard',
  },
  {
    to: routes.CUSTOMER_CARS,
    icon: Car,
    labelKey: 'customer.nav.myCars',
  },
  {
    to: routes.CUSTOMER_PROFILE,
    icon: User,
    labelKey: 'customer.nav.profile',
  },
];

const CustomerSidebar: FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isCompactMobile = useMediaQuery('(max-width: 450px)');

  const session = customerSession.getUser();
  const initials = `${session?.firstName?.charAt(0) ?? ''}${session?.lastName?.charAt(0) ?? ''}`.toUpperCase() || '??';

  const handleLogout = () => {
    customerSession.clear();
    navigate(routes.CUSTOMER_LOGIN);
  };

  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(to + '/');

  const renderVerticalNav = () => (
    <nav className="mt-8 flex flex-col items-center gap-4 w-full">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.to);

        return (
          <Link key={item.to} to={item.to} className="w-12 h-12 flex items-center justify-center relative">
            {active && <div className="absolute left-0 w-1 h-8 bg-primary-text rounded-r-full" />}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                active
                  ? 'bg-primary-text/20 text-primary-text'
                  : 'bg-transparent text-primary-text/70 hover:text-primary-text hover:bg-primary-text/10'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
          </Link>
        );
      })}
    </nav>
  );

  const renderBottomNav = (colorMode: 'onPrimary' | 'onCard' = 'onPrimary', onItemClick?: () => void) => {
    const inactiveColor = colorMode === 'onPrimary' ? 'text-primary-text/70' : 'text-muted';
    const activeColor = colorMode === 'onPrimary' ? 'text-primary-text' : 'text-primary';
    const activeBg = colorMode === 'onPrimary' ? 'bg-primary-text/20' : 'bg-primary-light';

    return (
      <nav className="flex justify-center gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onItemClick}
              className="w-9 h-9 flex items-center justify-center"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  active ? `${activeBg} ${activeColor}` : `bg-transparent ${inactiveColor} hover:${activeColor}`
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

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-16 flex-col items-center bg-primary text-primary-text py-4 z-20 border-r border-primary-hover">
        <div className="w-10 h-10 rounded-lg bg-primary-text/20 text-primary-text flex items-center justify-center font-bold text-lg">
          {initials}
        </div>

        <div className="mt-4 scale-90">
          <LanguageSelector />
        </div>

        {renderVerticalNav()}

        <div className="mt-auto mb-3">
          <IconButton onClick={handleLogout} aria-label="Logout" variant="dangerGhost" size="md">
            <Power className="w-5 h-5" />
          </IconButton>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary text-primary-text flex items-center px-4 py-3 z-50 border-t border-primary-hover">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-text/20 text-primary-text flex items-center justify-center font-bold text-sm">
            {initials}
          </div>
          <div className="scale-90">
            <LanguageSelector />
          </div>
        </div>

        {!isCompactMobile && (
          <>
            <div className="absolute left-1/2 -translate-x-1/2">{renderBottomNav('onPrimary')}</div>

            <div className="ml-auto">
              <IconButton onClick={handleLogout} aria-label="Logout" variant="dangerGhost" size="sm">
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
                <div className="bg-surface text-text rounded-xl px-4 py-3 flex items-center gap-4 border border-border">
                  {renderBottomNav('onCard', () => setMenuOpen(false))}

                  <IconButton
                    onClick={handleLogout}
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

export default CustomerSidebar;
