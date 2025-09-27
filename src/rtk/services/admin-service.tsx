import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { Company } from '../../models/Company';
import { prepareRequestHeaders } from '../../utils/prepareRequestHeaders';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.baseUrl}${config.adminApiUrl}`,
    prepareHeaders: prepareRequestHeaders,
    credentials: 'include',
  }),
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    fetchAdminCompanies: builder.query<Company[], void>({
      query: () => '/companies',
    }),
  }),
});

export const { useFetchAdminCompaniesQuery } = adminApi;
