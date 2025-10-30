import { createApi } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { Company } from '../../models/Company';
import {createBaseQueryWithReAuth} from "../baseQuery.ts";

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: createBaseQueryWithReAuth(`${config.baseUrl}${config.adminApiUrl}`),
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    fetchAdminCompanies: builder.query<Company[], void>({
      query: () => '/companies',
    }),
  }),
});

export const { useFetchAdminCompaniesQuery } = adminApi;
