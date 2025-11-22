import { createApi } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { LicensePlatePattern } from '../../models/LicensePlatePattern';
import { baseQueryWithReAuth } from '../baseQuery';

export const licensePlatePatternsApi = createApi({
  reducerPath: 'licensePlatePatternsApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    fetchLicensePlatePatterns: builder.query<LicensePlatePattern[], void>({
      query: () => config.licensePlatePatternsUrl,
    }),
  }),
});

export const { useFetchLicensePlatePatternsQuery } = licensePlatePatternsApi;
