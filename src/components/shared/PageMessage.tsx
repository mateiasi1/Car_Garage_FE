import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/authContext';
import { Role } from '../../utils/enums/Role';
import { useGetBranchSmsUsageQuery } from '../../rtk/services/branch-service';

import { TriangleAlert, XCircle } from 'lucide-react';

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

  const wrapperBg = isErrorState ? 'bg-error' : 'bg-warning';
  const Icon = isErrorState ? XCircle : TriangleAlert;

  return (
    <>
      <div className="fixed top-0 right-0 left-0 md:left-16 z-[50]">
        <div
          className={`
            ${wrapperBg} text-text
            w-full
            flex items-center gap-3
            px-4 sm:px-6 py-3
            border-b border-border
          `}
        >
          <Icon className="h-6 w-6 text-text flex-shrink-0" />

          <div className="flex flex-col gap-0.5">
            <div className="font-heading font-semibold text-base sm:text-lg text-text">
              {isErrorState ? t('smsBanner.errorTitle') : t('smsBanner.warningTitle')}
            </div>
            <div className="text-sm sm:text-base font-body text-text/90">
              {isErrorState
                ? t('smsBanner.errorBody')
                : t('smsBanner.warningBody', { percent: Math.round(remainingPercent) })}
            </div>
          </div>
        </div>
      </div>

      <div className="h-20 sm:h-18 md:h-16" />
    </>
  );
};

export default PageMessage;
