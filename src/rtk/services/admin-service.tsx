import { createApi } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { Company } from '../../models/Company';
import { createBaseQueryWithReAuth } from '../baseQuery';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: createBaseQueryWithReAuth(`${config.baseUrl}${config.adminApiUrl}`),
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    fetchAdminCompanies: builder.query<Company[], void>({
      query: () => '/companies',
      providesTags: ['Admin'],
    }),
    createCompany: builder.mutation<Company, Partial<Company>>({
      query: (company) => ({
        url: '/company',
        method: 'POST',
        body: company,
      }),
      invalidatesTags: ['Admin'],
    }),
    updateCompany: builder.mutation<Company, Partial<Company> & { companyId?: string }>({
      query: (company) => {
        const id = (company as any).companyId ?? (company as any).id;
        return {
          url: id ? `/company/${id}` : '/company',
          method: 'PUT',
          body: company,
        };
      },
      invalidatesTags: ['Admin'],
    }),
    deleteCompany: builder.mutation<void, string>({
      query: (id) => ({
        url: `/company/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
});

export const {
  useFetchAdminCompaniesQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = adminApi;
