import { createApi } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { Company } from '../../models/Company';
import { baseQueryWithReAuth } from '../baseQuery';

export interface CreateCompanyRequest {
  name: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  street: string;
  streetNumber?: string;
  houseNumber?: string;
  zipcode?: string;
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {
  companyId: string;
}

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Companies'],
  endpoints: (builder) => ({
    fetchCompanies: builder.query<Company[], void>({
      query: () => ({
        url: config.companiesUrl,
        method: 'GET',
      }),
      providesTags: ['Companies'],
    }),
    createCompany: builder.mutation<void, CreateCompanyRequest>({
      query: (body) => ({
        url: config.companyUrl,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Companies'],
    }),
    updateCompany: builder.mutation<void, UpdateCompanyRequest>({
      query: ({ companyId, ...body }) => ({
        url: `${config.companyUrl}/${companyId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Companies'],
    }),
    deleteCompany: builder.mutation<void, string>({
      query: (companyId) => ({
        url: `${config.companyUrl}/${companyId}`,
        method: 'DELETE',
        body: {},
      }),
      invalidatesTags: ['Companies'],
    }),
  }),
});

export const { useFetchCompaniesQuery, useCreateCompanyMutation, useUpdateCompanyMutation, useDeleteCompanyMutation } =
  companyApi;
