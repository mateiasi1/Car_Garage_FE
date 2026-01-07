import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, TrendingUp, Users, Award } from 'lucide-react';
import { StatCard, BarChart, PieChart, DoughnutChart, LineChart, ChartWrapper } from '../../charts';
import { OwnerStatisticsResponse } from '../../../rtk/services/statistics-service';

interface OwnerStatisticsProps {
  data: OwnerStatisticsResponse;
  hideInspectorAndBranchStats?: boolean;
}

export const OwnerStatistics: FC<OwnerStatisticsProps> = ({ data, hideInspectorAndBranchStats = false }) => {
  const { t } = useTranslation();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const typeLabels: Record<string, string> = {
    TWO_YEARS: t('statistics.inspectionTypes.twoYears'),
    ONE_YEAR: t('statistics.inspectionTypes.oneYear'),
    '6_MONTHS': t('statistics.inspectionTypes.sixMonths'),
  };

  // ISO day of week: 1 = Monday, 7 = Sunday
  const dayOfWeekLabels: Record<string, string> = {
    '1': t('statistics.daysOfWeek.monday'),
    '2': t('statistics.daysOfWeek.tuesday'),
    '3': t('statistics.daysOfWeek.wednesday'),
    '4': t('statistics.daysOfWeek.thursday'),
    '5': t('statistics.daysOfWeek.friday'),
    '6': t('statistics.daysOfWeek.saturday'),
    '7': t('statistics.daysOfWeek.sunday'),
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${hideInspectorAndBranchStats ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4`}>
        <StatCard
          title={t('statistics.totalInspections')}
          value={data.summary.totalInspections}
          icon={<ClipboardList className="w-6 h-6" />}
        />
        <StatCard
          title={t('statistics.avgPerDay')}
          value={data.summary.avgPerDay}
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <StatCard
          title={t('statistics.newCustomers')}
          value={data.customerStats.newCustomers}
          icon={<Users className="w-6 h-6" />}
        />
        {!hideInspectorAndBranchStats && (
          <StatCard
            title={t('statistics.topInspector')}
            value={data.summary.topInspector?.name || '-'}
            icon={<Award className="w-6 h-6" />}
            smallValue
          />
        )}
      </div>

      {/* Trend Chart - Full Width */}
      <LineChart
        title={t('statistics.inspectionsTrend')}
        subtitle={t('statistics.inspectionsTrendSubtitle')}
        labels={data.inspectionsTrend.map((item) => formatDate(item.date))}
        data={data.inspectionsTrend.map((item) => item.count)}
        label={t('statistics.inspections')}
      />

      {/* Inspector Performance - Full Width */}
      {!hideInspectorAndBranchStats && (
        <BarChart
          title={t('statistics.byInspector')}
          subtitle={t('statistics.byInspectorSubtitle')}
          labels={data.inspectionsByInspector.map((item) => item.name)}
          data={data.inspectionsByInspector.map((item) => item.count)}
          label={t('statistics.inspections')}
        />
      )}

      {/* Row 2: Category & Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          title={t('statistics.byCategory')}
          subtitle={t('statistics.byCategorySubtitle')}
          labels={data.inspectionsByCategory.map((item) => `${t('statistics.category')} ${item.name}`)}
          data={data.inspectionsByCategory.map((item) => item.count)}
        />
        <DoughnutChart
          title={t('statistics.byType')}
          subtitle={t('statistics.byTypeSubtitle')}
          labels={data.inspectionsByType.map((item) => typeLabels[item.name] || item.name)}
          data={data.inspectionsByType.map((item) => item.count)}
        />
      </div>

      {/* Row 3: Day of Week & Branch */}
      {hideInspectorAndBranchStats ? (
        <BarChart
          title={t('statistics.byDayOfWeek')}
          subtitle={t('statistics.byDayOfWeekSubtitle')}
          labels={data.inspectionsByDayOfWeek.map((item) => dayOfWeekLabels[item.name] || item.name)}
          data={data.inspectionsByDayOfWeek.map((item) => item.count)}
          label={t('statistics.inspections')}
          backgroundColor="rgba(16, 185, 129, 0.8)"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChart
            title={t('statistics.byDayOfWeek')}
            subtitle={t('statistics.byDayOfWeekSubtitle')}
            labels={data.inspectionsByDayOfWeek.map((item) => dayOfWeekLabels[item.name] || item.name)}
            data={data.inspectionsByDayOfWeek.map((item) => item.count)}
            label={t('statistics.inspections')}
            backgroundColor="rgba(16, 185, 129, 0.8)"
          />
          <BarChart
            title={t('statistics.byBranch')}
            subtitle={t('statistics.byBranchSubtitle')}
            labels={data.inspectionsByBranch.map((item) => item.name)}
            data={data.inspectionsByBranch.map((item) => item.count)}
            label={t('statistics.inspections')}
            horizontal
            backgroundColor="rgba(139, 92, 246, 0.8)"
          />
        </div>
      )}

      {/* Row 5: Customer Stats & SMS Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DoughnutChart
          title={t('statistics.customerDistribution')}
          subtitle={t('statistics.customerDistributionSubtitle')}
          labels={[t('statistics.newCustomers'), t('statistics.returningCustomers')]}
          data={[data.customerStats.newCustomers, data.customerStats.returningCustomers]}
        />
        <ChartWrapper title={t('statistics.smsUsage')} subtitle={t('statistics.smsUsageSubtitle')}>
          {data.smsUsage && data.smsUsage.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {data.smsUsage.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{item.branchName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.percentage > 80 ? 'bg-error' : item.percentage > 50 ? 'bg-warning' : 'bg-success'
                        }`}
                        style={{ width: `${Math.min(item.percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-text/70 w-20 text-right">
                      {item.used}/{item.limit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text/50 text-sm text-center py-8">{t('statistics.noData')}</p>
          )}
        </ChartWrapper>
      </div>
    </div>
  );
};
