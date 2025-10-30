import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import {Company, UpdatePackageRequest, UpdatePackageResponse} from '../../models/Company';
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
    updatePackage: builder.mutation<UpdatePackageResponse, UpdatePackageRequest>({
      query: (body) => ({
          url: '/company/package',
          method: 'PUT',
          body,
      }),
    }),
  }),
});

export const { useFetchCompaniesQuery, useUpdatePackageMutation } = companyApi;
