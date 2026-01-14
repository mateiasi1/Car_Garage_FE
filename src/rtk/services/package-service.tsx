import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from '../baseQuery';
import { Package } from '../../models/Package';

export const packagesApi = createApi({
  reducerPath: 'packagesApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Package'],
  endpoints: (builder) => ({
    fetchPackages: builder.query<Package[], { companyId?: string } | void>({
      query: (arg) => {
        const companyId = arg && typeof arg === 'object' ? arg.companyId : undefined;
        return {
          url: '/packages',
          method: 'GET',
          params: companyId ? { companyId } : undefined,
        };
      },
      providesTags: ['Package'],
    }),
    fetchPublicPackages: builder.query<Package[], void>({
      query: () => ({
        url: '/packages/public',
        method: 'GET',
      }),
      providesTags: ['Package'],
    }),
  }),
});

export const { useFetchPackagesQuery, useFetchPublicPackagesQuery } = packagesApi;
