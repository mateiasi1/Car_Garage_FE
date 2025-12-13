import { createApi } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { baseQueryWithReAuth } from '../baseQuery';

export type StatisticsPeriod = 'today' | 'week' | 'month' | 'year' | 'all' | 'custom';

export interface PackageFeaturesResponse {
  allowedPeriods: StatisticsPeriod[];
  packageName: string | null;
}

export interface StatisticsFilters {
  period: StatisticsPeriod;
  fromDate?: string;
  toDate?: string;
}

interface CountItem {
  name: string;
  count: number;
}

interface InspectorStats {
  name: string;
  count: number;
  avgPerDay: number;
}

interface TrendItem {
  date: string;
  count: number;
}

interface BranchStats {
  branchName: string;
  companyName: string;
  count: number;
}

interface SmsUsageItem {
  companyName?: string;
  branchName: string;
  used: number;
  limit: number;
  percentage: number;
}

export interface OwnerStatisticsResponse {
  summary: {
    totalInspections: number;
    avgPerDay: number;
    previousPeriodChange: number;
    topInspector: { name: string; count: number } | null;
  };
  inspectionsByInspector: InspectorStats[];
  inspectionsByCategory: CountItem[];
  inspectionsByType: CountItem[];
  inspectionsByBranch: CountItem[];
  inspectionsByCounty: CountItem[];
  inspectionsTrend: TrendItem[];
  inspectionsByDayOfWeek: CountItem[];
  customerStats: { newCustomers: number; returningCustomers: number };
  smsUsage: SmsUsageItem[];
  period: { from: string; to: string };
}

export interface AdminStatisticsResponse {
  summary: {
    totalInspections: number;
    totalCompanies: number;
    activeCompanies: number;
    inactiveCompanies: number;
    previousPeriodChange: number;
  };
  inspectionsByCategory: CountItem[];
  inspectionsByType: CountItem[];
  inspectionsByCounty: CountItem[];
  inspectionsByCompany: CountItem[];
  topBranches: BranchStats[];
  inspectionsTrend: TrendItem[];
  companiesTrend: TrendItem[];
  smsUsage: SmsUsageItem[];
  packageDistribution: CountItem[];
  period: { from: string; to: string };
}

export const statisticsApi = createApi({
  reducerPath: 'statisticsApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Statistics', 'PackageFeatures'],
  endpoints: (builder) => ({
    fetchOwnerStatistics: builder.query<OwnerStatisticsResponse, StatisticsFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        params.append('period', filters.period);
        if (filters.fromDate) params.append('fromDate', filters.fromDate);
        if (filters.toDate) params.append('toDate', filters.toDate);
        return {
          url: `${config.statisticsUrl}/owner?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Statistics'],
    }),
    fetchAdminStatistics: builder.query<AdminStatisticsResponse, StatisticsPeriod>({
      query: (period) => ({
        url: `${config.statisticsUrl}/admin?period=${period}`,
        method: 'GET',
      }),
      providesTags: ['Statistics'],
    }),
    fetchPackageFeatures: builder.query<PackageFeaturesResponse, void>({
      query: () => ({
        url: `${config.statisticsUrl}/features`,
        method: 'GET',
      }),
      providesTags: ['PackageFeatures'],
    }),
  }),
});

export const { useFetchOwnerStatisticsQuery, useFetchAdminStatisticsQuery, useFetchPackageFeaturesQuery } =
  statisticsApi;
