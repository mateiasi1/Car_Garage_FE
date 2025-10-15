import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { Company } from '../../models/Company';
import { prepareRequestHeaders } from '../../utils/prepareRequestHeaders';

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseUrl,
    prepareHeaders: (headers, { arg }) => prepareRequestHeaders(headers, arg),
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    fetchCompanies: builder.query<Company, void>({
      query: () => ({
        url: config.companiesUrl,
        method: 'GET',
      }),
    }),
  }),
});

export const { useFetchCompaniesQuery } = companyApi;
