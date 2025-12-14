import { createApi } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { Company } from '../../models/Company';
import { createBaseQueryWithReAuth } from '../baseQuery';
import { Branch } from '../../models/Branch';
import { CreateBranchRequest, UpdateBranchRequest } from './branch-service';

export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  roles: string[];
  branchId?: string;
  canSendSms?: boolean;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  branchId?: string;
  canSendSms?: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  canSendSms?: boolean;
  roles: string[];
  activeBranch?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: createBaseQueryWithReAuth(`${config.baseUrl}${config.adminApiUrl}`),
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    fetchAdminCompanies: builder.query<Company[], void>({
      query: () => config.companiesUrl,
      providesTags: ['Admin'],
    }),
    createAdminCompany: builder.mutation<Company, Partial<Company>>({
      query: (company) => ({
        url: config.companyUrl,
        method: 'POST',
        body: company,
      }),
      invalidatesTags: ['Admin'],
    }),
    updateAdminCompany: builder.mutation<Company, Partial<Company> & { companyId: string }>({
      query: (company) => {
        return {
          url: `${config.companyUrl}/${company.companyId}`,
          method: 'PUT',
          body: company,
        };
      },
      invalidatesTags: ['Admin'],
    }),
    deleteAdminCompany: builder.mutation<void, string>({
      query: (id) => ({
        url: `${config.companyUrl}/${id}`,
        method: 'DELETE',
        body: {},
      }),
      invalidatesTags: ['Admin'],
    }),
    fetchAdminCompanyBranches: builder.query<Branch[], string>({
      query: (companyId) => ({
        url: `${config.companiesUrl}/${companyId}/branches`,
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),
    createAdminBranch: builder.mutation<Branch, { companyId: string; data: CreateBranchRequest }>({
      query: ({ companyId, data }) => ({
        url: `${config.companiesUrl}/${companyId}/branches`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Admin'],
    }),
    updateAdminBranch: builder.mutation<Branch, UpdateBranchRequest & { companyId: string }>({
      query: ({ companyId, branchId, ...data }) => ({
        url: `${config.companiesUrl}/${companyId}/branches/${branchId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Admin'],
    }),
    deleteAdminBranch: builder.mutation<void, { companyId: string; branchId: string }>({
      query: ({ companyId, branchId }) => ({
        url: `${config.companiesUrl}/${companyId}/branches/${branchId}`,
        method: 'DELETE',
        body: {},
      }),
      invalidatesTags: ['Admin'],
    }),
    fetchAdminCompanyUsers: builder.query<AdminUser[], string>({
      query: (companyId) => ({
        url: `${config.companiesUrl}/${companyId}/users`,
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),

    createAdminUser: builder.mutation<void, { companyId: string; data: CreateUserDTO }>({
      query: ({ companyId, data }) => ({
        url: `${config.companiesUrl}/${companyId}/users`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Admin'],
    }),

    updateAdminUser: builder.mutation<void, { companyId: string; userId: string; data: UpdateUserDTO }>({
      query: ({ companyId, userId, data }) => ({
        url: `${config.companiesUrl}/${companyId}/users/${userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Admin'],
    }),

    deleteAdminUser: builder.mutation<void, { companyId: string; userId: string }>({
      query: ({ companyId, userId }) => ({
        url: `${config.companiesUrl}/${companyId}/users/${userId}`,
        method: 'DELETE',
        body: {},
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
});

export const {
  useFetchAdminCompaniesQuery,
  useCreateAdminCompanyMutation,
  useUpdateAdminCompanyMutation,
  useDeleteAdminCompanyMutation,
  useFetchAdminCompanyBranchesQuery,
  useCreateAdminBranchMutation,
  useUpdateAdminBranchMutation,
  useDeleteAdminBranchMutation,
  useFetchAdminCompanyUsersQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
} = adminApi;
