import { createApi } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { Company } from '../../models/Company';
import { createBaseQueryWithReAuth } from '../baseQuery';
import {Branch} from "../../models/Branch.ts";
import {CreateBranchRequest, UpdateBranchRequest} from "./branch-service.tsx";

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
} = adminApi;
