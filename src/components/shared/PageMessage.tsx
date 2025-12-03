import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/authContext';
import { Role } from '../../utils/enums/Role';
import { useGetBranchSmsUsageQuery } from '../../rtk/services/branch-service';
import { AlertTriangle, XCircle } from 'lucide-react';

const PageMessage: FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useContext(AuthContext);

  const userRoles = user?.roles?.map((r) => r.name as Role) ?? [];
  const isAdmin = userRoles.includes(Role.admin);
  const isOwnerOrInspector = userRoles.includes(Role.owner) || userRoles.includes(Role.inspector);

  const { data, isLoading, isError } = useGetBranchSmsUsageQuery(undefined, {
    skip: !isOwnerOrInspector || !isAuthenticated,
    pollingInterval: 30 * 60 * 1000,
    refetchOnMountOrArgChange: true,
  });

  if (!isAuthenticated || isAdmin || !isOwnerOrInspector) return null;
  if (isLoading || isError || !data) return null;

  const { remainingPercent, status } = data;
  if (status === 'ok') return null;

  const isErrorState = status === 'empty';

  // Error: red theme, Warning: amber theme (like DemoBanner)
  const bgColor = isErrorState ? 'bg-red-50' : 'bg-amber-50';
  const borderColor = isErrorState ? 'border-red-200' : 'border-amber-200';
  const textColor = isErrorState ? 'text-red-800' : 'text-amber-800';
  const textMuted = isErrorState ? 'text-red-700' : 'text-amber-700';
  const Icon = isErrorState ? XCircle : AlertTriangle;

  return (
    <>
      <div className="fixed top-0 right-0 left-0 md:left-16 z-[50]">
        <div className={`${bgColor} border-b ${borderColor} w-full px-4 sm:px-6 py-3`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {/* Title */}
            <div className="flex items-center gap-2">
              <Icon className={`w-5 h-5 ${textMuted} flex-shrink-0`} />
              <div>
                <span className={`font-semibold ${textColor}`}>
                  {isErrorState ? t('smsBanner.errorTitle') : t('smsBanner.warningTitle')}
                </span>
                <span className={`${textMuted} ml-2`}>—</span>
                <span className={`${textMuted} ml-2 text-sm`}>
                  {isErrorState
                    ? t('smsBanner.errorBody')
                    : t('smsBanner.warningBody', { percent: Math.round(remainingPercent) })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-14 sm:h-12" />
    </>
  );
};

export default PageMessage;
