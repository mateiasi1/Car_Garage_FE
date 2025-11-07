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
} = adminApi;
