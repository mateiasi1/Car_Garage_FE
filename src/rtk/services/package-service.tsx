import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from '../baseQuery';
import { Package } from '../../models/Branch';

export const packagesApi = createApi({
  reducerPath: 'packagesApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    fetchPackages: builder.query<Package[], void>({
      query: () => ({
        url: '/packages',
        method: 'GET',
      }),
    }),
  }),
});

export const { useFetchPackagesQuery } = packagesApi;
