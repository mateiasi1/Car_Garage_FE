import { FC, useMemo } from 'react';

interface SidebarUserSectionProps {
  expanded: boolean;
  user: User | undefined;
}

const SidebarUserSection: FC<SidebarUserSectionProps> = ({ expanded, user }) => {
  const rolesString = useMemo(
    () => user?.roles?.map((r) => r.name.charAt(0) + r.name.slice(1).toLowerCase()).join(', ') || '',
    [user]
  );

  return (
    <div
      className={`flex px-4 py-6 transition-all duration-300 ${
        expanded ? 'items-center gap-3 justify-start' : 'items-center justify-center'
      }`}
    >
      <div className={`flex w-10 ${expanded ? '' : 'justify-center'}`}>
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">
          {user ? user.firstName[0] : ''}
        </div>
      </div>
      <div
        className={`transition-all duration-300 ${
          expanded ? 'opacity-100 w-auto ml-2' : 'opacity-0 w-0 ml-0'
        } overflow-hidden`}
      >
        <div className="font-semibold text-white whitespace-nowrap">
          {user ? `${user.firstName} ${user.lastName}` : ''}
        </div>
        <div className="text-xs text-gray-300 whitespace-nowrap">{rolesString}</div>
      </div>
    </div>
  );
};

export default SidebarUserSection;
