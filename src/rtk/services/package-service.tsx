import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from '../baseQuery';
import { Package } from '../../models/Package';

export const packagesApi = createApi({
  reducerPath: 'packagesApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Package'],
  endpoints: (builder) => ({
    fetchPackages: builder.query<Package[], void>({
      query: () => ({
        url: '/packages',
        method: 'GET',
      }),
      providesTags: ['Package'],
    }),
  }),
});

export const { useFetchPackagesQuery } = packagesApi;
