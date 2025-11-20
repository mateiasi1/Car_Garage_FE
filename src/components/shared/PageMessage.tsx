// src/components/shared/PageMessage.tsx
import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/authContext';
import { Role } from '../../utils/enums/Role';
import { useGetBranchSmsUsageQuery } from '../../rtk/services/branch-service';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

interface Props {
    sidebarWidth: string;
}

const PageMessage: FC<Props> = ({ sidebarWidth }) => {
    const { t } = useTranslation();
    const { isAuthenticated, user } = useContext(AuthContext);

    const userRoles = user?.roles?.map((r) => r.name as Role) ?? [];
    const isAdmin = userRoles.includes(Role.admin);
    const isOwnerOrInspector =
        userRoles.includes(Role.owner) || userRoles.includes(Role.inspector);

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

    const bgColor = isErrorState ? 'bg-error text-primary-text' : 'bg-warning text-text';
    const icon = isErrorState ? faCircleXmark : faTriangleExclamation;

    return (
        <div
            className="absolute top-0 right-0 z-[9999]"
            style={{ left: sidebarWidth }}
        >
            <div className={`${bgColor} w-full py-1 px-2 flex items-center gap-3 shadow-lg`}>
                <FontAwesomeIcon icon={icon} className="h-6 w-6" />

                <div>
                    <div className="font-heading font-semibold">
                        {isErrorState ? t('smsBanner.errorTitle') : t('smsBanner.warningTitle')}
                    </div>
                    <div className="text-sm opacity-90">
                        {isErrorState
                            ? t('smsBanner.errorBody')
                            : t('smsBanner.warningBody', { percent: Math.round(remainingPercent) })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageMessage;
