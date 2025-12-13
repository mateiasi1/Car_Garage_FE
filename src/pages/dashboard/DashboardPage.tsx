import { FC, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Loader2, Lock, Calendar } from 'lucide-react';
import { PageContainer } from '../../components/shared/PageContainer';
import { PageHeader } from '../../components/shared/PageHeader';
import { OwnerStatistics, AdminStatistics } from '../../components/administration/statistics';
import {
  useFetchOwnerStatisticsQuery,
  useFetchAdminStatisticsQuery,
  useFetchPackageFeaturesQuery,
  StatisticsPeriod,
} from '../../rtk/services/statistics-service';
import { useUserRoles } from '../../hooks/useUserRoles';
import { Role } from '../../utils/enums/Role';

const PERIODS: { value: StatisticsPeriod; labelKey: string }[] = [
  { value: 'today', labelKey: 'statistics.periods.today' },
  { value: 'week', labelKey: 'statistics.periods.week' },
  { value: 'month', labelKey: 'statistics.periods.month' },
  { value: 'year', labelKey: 'statistics.periods.year' },
  { value: 'all', labelKey: 'statistics.periods.all' },
  { value: 'custom', labelKey: 'statistics.periods.custom' },
];

const DashboardPage: FC = () => {
  const { t } = useTranslation();
  const { roles } = useUserRoles();
  const [period, setPeriod] = useState<StatisticsPeriod>('week');
  const [customFromDate, setCustomFromDate] = useState<string>('');
  const [customToDate, setCustomToDate] = useState<string>('');

  const isAdmin = roles.includes(Role.admin);
  const isOwner = roles.includes(Role.owner) || roles.includes(Role.demo);

  // Fetch package features to know which periods are allowed
  const { data: packageFeatures } = useFetchPackageFeaturesQuery(undefined, { skip: !isOwner });

  // Default allowed periods (Basic/no package)
  const allowedPeriods = useMemo(() => {
    if (isAdmin) {
      // Admin can see all periods
      return ['today', 'week', 'month', 'year', 'all', 'custom'] as StatisticsPeriod[];
    }
    return packageFeatures?.allowedPeriods || ['today', 'week'];
  }, [packageFeatures, isAdmin]);

  // Build query filters for owner statistics
  const ownerFilters = useMemo(() => {
    const filters: { period: StatisticsPeriod; fromDate?: string; toDate?: string } = { period };
    if (period === 'custom' && customFromDate && customToDate) {
      filters.fromDate = customFromDate;
      filters.toDate = customToDate;
    }
    return filters;
  }, [period, customFromDate, customToDate]);

  // Skip owner query if custom period without dates
  const skipOwnerQuery = !isOwner || (period === 'custom' && (!customFromDate || !customToDate));

  const {
    data: ownerData,
    isLoading: ownerLoading,
    error: ownerError,
  } = useFetchOwnerStatisticsQuery(ownerFilters, { skip: skipOwnerQuery });

  const {
    data: adminData,
    isLoading: adminLoading,
    error: adminError,
  } = useFetchAdminStatisticsQuery(period, { skip: !isAdmin });

  const isLoading = ownerLoading || adminLoading;
  const hasError = ownerError || adminError;

  const handlePeriodClick = (p: StatisticsPeriod) => {
    if (allowedPeriods.includes(p)) {
      setPeriod(p);
    }
  };

  return (
    <PageContainer className="px-2 sm:px-6 lg:px-10 py-4 sm:py-6 overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto overflow-x-hidden">
        <PageHeader icon={BarChart3} title={t('statistics.title')} />

        {/* Period Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {PERIODS.map((p) => {
            const isAllowed = allowedPeriods.includes(p.value);
            const isActive = period === p.value;

            return (
              <button
                key={p.value}
                onClick={() => handlePeriodClick(p.value)}
                disabled={!isAllowed}
                title={!isAllowed ? t('statistics.upgradeRequired') : undefined}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'bg-primary text-primary-text'
                    : isAllowed
                      ? 'bg-surface border border-border text-text hover:bg-primary/10'
                      : 'bg-surface/50 border border-border/50 text-text/40 cursor-not-allowed'
                }`}
              >
                {t(p.labelKey)}
                {!isAllowed && <Lock className="w-3 h-3" />}
              </button>
            );
          })}
        </div>

        {/* Custom Date Range Picker */}
        {period === 'custom' && allowedPeriods.includes('custom') && (
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-surface rounded-lg border border-border">
            <Calendar className="w-5 h-5 text-primary" />
            <div className="flex items-center gap-2">
              <label className="text-sm text-text/70">{t('statistics.fromDate')}:</label>
              <input
                type="date"
                value={customFromDate}
                onChange={(e) => setCustomFromDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-text/70">{t('statistics.toDate')}:</label>
              <input
                type="date"
                value={customToDate}
                onChange={(e) => setCustomToDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-text/70 font-body">{t('statistics.loading')}</span>
          </div>
        )}

        {/* Error State */}
        {hasError && !isLoading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-error font-body">{t('statistics.error')}</p>
          </div>
        )}

        {/* Statistics Content */}
        {!isLoading && !hasError && (
          <div className="space-y-8">
            {isAdmin && adminData && (
              <div>
                <h2 className="text-xl font-heading font-semibold text-text mb-4">{t('statistics.adminDashboard')}</h2>
                <AdminStatistics data={adminData} />
              </div>
            )}

            {isOwner && ownerData && (
              <div>
                {isAdmin && (
                  <h2 className="text-xl font-heading font-semibold text-text mb-4 mt-8">
                    {t('statistics.ownerDashboard')}
                  </h2>
                )}
                <OwnerStatistics data={ownerData} />
              </div>
            )}

            {/* Empty State */}
            {!adminData && !ownerData && (
              <div className="flex flex-col items-center justify-center py-20">
                <BarChart3 className="w-16 h-16 text-text/20 mb-4" />
                <p className="text-text/60 font-body">{t('statistics.noData')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
