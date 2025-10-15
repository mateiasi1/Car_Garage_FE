import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { prepareRequestHeaders } from '../../utils/prepareRequestHeaders';
import { LicensePlatePattern } from '../../models/LicensePlatePattern';

export const licensePlatePatternsApi = createApi({
  reducerPath: 'licensePlatePatternsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseUrl,
    prepareHeaders: (headers, { arg }) => prepareRequestHeaders(headers, arg),
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    fetchLicensePlatePatterns: builder.query<LicensePlatePattern[], void>({
      query: () => config.licensePlatePatternsUrl,
    }),
  }),
});

export const { useFetchLicensePlatePatternsQuery } = licensePlatePatternsApi;
