import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, Building2, CheckCircle, XCircle } from 'lucide-react';
import { StatCard, BarChart, PieChart, DoughnutChart, LineChart, ChartWrapper } from '../../charts';
import { AdminStatisticsResponse } from '../../../rtk/services/statistics-service';

interface AdminStatisticsProps {
  data: AdminStatisticsResponse;
}

export const AdminStatistics: FC<AdminStatisticsProps> = ({ data }) => {
  const { t } = useTranslation();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' });
  };

  const typeLabels: Record<string, string> = {
    TWO_YEARS: t('statistics.inspectionTypes.twoYears'),
    ONE_YEAR: t('statistics.inspectionTypes.oneYear'),
    '6_MONTHS': t('statistics.inspectionTypes.sixMonths'),
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('statistics.totalInspections')}
          value={data.summary.totalInspections}
          icon={<ClipboardList className="w-6 h-6" />}
        />
        <StatCard
          title={t('statistics.totalCompanies')}
          value={data.summary.totalCompanies}
          icon={<Building2 className="w-6 h-6" />}
        />
        <StatCard
          title={t('statistics.activeCompanies')}
          value={data.summary.activeCompanies}
          icon={<CheckCircle className="w-6 h-6" />}
        />
        <StatCard
          title={t('statistics.inactiveCompanies')}
          value={data.summary.inactiveCompanies}
          icon={<XCircle className="w-6 h-6" />}
        />
      </div>

      {/* Platform Growth - Full Width */}
      <LineChart
        title={t('statistics.platformGrowth')}
        subtitle={t('statistics.platformGrowthSubtitle')}
        labels={data.inspectionsTrend.map((item) => formatDate(item.date))}
        data={data.inspectionsTrend.map((item) => item.count)}
        label={t('statistics.inspections')}
      />

      {/* Row 2: Top Companies & Top Branches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          title={t('statistics.topCompanies')}
          subtitle={t('statistics.topCompaniesSubtitle')}
          labels={data.inspectionsByCompany.map((item) => item.name)}
          data={data.inspectionsByCompany.map((item) => item.count)}
          label={t('statistics.inspections')}
          horizontal
        />
        <BarChart
          title={t('statistics.topBranches')}
          subtitle={t('statistics.topBranchesSubtitle')}
          labels={data.topBranches.map((item) => `${item.branchName} (${item.companyName})`)}
          data={data.topBranches.map((item) => item.count)}
          label={t('statistics.inspections')}
          horizontal
          backgroundColor="rgba(16, 185, 129, 0.8)"
        />
      </div>

      {/* Row 3: Category & Type Distribution */}
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

      {/* Row 4: Package Distribution & Companies Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          title={t('statistics.packageDistribution')}
          subtitle={t('statistics.packageDistributionSubtitle')}
          labels={data.packageDistribution.map((item) => item.name)}
          data={data.packageDistribution.map((item) => item.count)}
        />
        <LineChart
          title={t('statistics.newCompanies')}
          subtitle={t('statistics.newCompaniesSubtitle')}
          labels={data.companiesTrend.map((item) => formatDate(item.date))}
          data={data.companiesTrend.map((item) => item.count)}
          label={t('statistics.companies')}
          borderColor="rgba(16, 185, 129, 1)"
          backgroundColor="rgba(16, 185, 129, 0.1)"
        />
      </div>

      {/* Row 5: By County & SMS Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          title={t('statistics.byCounty')}
          subtitle={t('statistics.byCountySubtitle')}
          labels={data.inspectionsByCounty.map((item) => item.name)}
          data={data.inspectionsByCounty.map((item) => item.count)}
          label={t('statistics.inspections')}
          horizontal
          backgroundColor="rgba(245, 158, 11, 0.8)"
        />
        <ChartWrapper title={t('statistics.smsUsage')} subtitle={t('statistics.smsUsageSubtitle')}>
          {data.smsUsage.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {data.smsUsage.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{item.branchName}</p>
                    <p className="text-xs text-text/60 truncate">{item.companyName}</p>
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
