import { createApi } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { Branch } from '../../models/Branch';
import { baseQueryWithReAuth } from '../baseQuery';

export interface CreateBranchRequest {
  name: string;
  country: string;
  city: string;
  street: string;
  streetNumber?: string;
  houseNumber?: string;
  zipcode?: string;
  phoneNumber?: string;
}

export interface UpdateBranchRequest extends Partial<CreateBranchRequest> {
  branchId: string;
}

export interface UpdatePackageRequest {
  packageId: string;
  period: 'monthly' | 'yearly';
}

export interface BranchSmsUsage {
  remainingCount: number;
  totalLimit: number;
  remainingPercent: number;
  status: 'ok' | 'low' | 'empty';
}

export const branchApi = createApi({
  reducerPath: 'branchApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Branch'],
  endpoints: (builder) => ({
    fetchBranch: builder.query<Branch, void>({
      query: () => ({
        url: config.branchUrl, // GET /branch
        method: 'GET',
      }),
      providesTags: ['Branch'],
    }),
    fetchCompanyBranches: builder.query<Branch[], void>({
      query: () => ({
        url: `${config.companyUrl}/branches`,
        method: 'GET',
      }),
      providesTags: ['Branch'],
    }),
    createBranch: builder.mutation<void, CreateBranchRequest>({
      query: (newBranch) => ({
        url: config.branchUrl,
        method: 'POST',
        body: newBranch,
      }),
      invalidatesTags: ['Branch'],
    }),
    updateBranch: builder.mutation<void, UpdateBranchRequest>({
      query: ({ branchId, ...body }) => ({
        url: `${config.branchUrl}/${branchId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Branch'],
    }),
    deleteBranch: builder.mutation<void, string>({
      query: (branchId) => ({
        url: `${config.branchUrl}/${branchId}`,
        method: 'DELETE',
        body: undefined,
      }),
      invalidatesTags: ['Branch'],
    }),
    updateBranchPackage: builder.mutation<void, { branchId: string; data: UpdatePackageRequest }>({
      query: ({ branchId, data }) => ({
        url: `${config.branchUrl}/${branchId}/package`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Branch'],
    }),
    getBranchSmsUsage: builder.query<BranchSmsUsage, void>({
      query: () => ({
        url: `${config.branchUrl}/sms-usage`, // ex: /branches/sms-usage
        method: 'GET',
      }),
      providesTags: ['Branch'],
    }),
  }),
});

export const {
  useFetchBranchQuery,
  useFetchCompanyBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useUpdateBranchPackageMutation,
  useGetBranchSmsUsageQuery,
} = branchApi;
