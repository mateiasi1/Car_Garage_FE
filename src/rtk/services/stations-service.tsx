import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { PublicStation } from '../../models/Branch';

// Public API - no authentication required
export const stationsApi = createApi({
  reducerPath: 'stationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      headers.set('Accept-Language', 'ro');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Stations'],
  endpoints: (builder) => ({
    fetchPublicStations: builder.query<PublicStation[], void>({
      query: () => ({
        url: '/stations/public',
        method: 'GET',
      }),
      providesTags: ['Stations'],
    }),
  }),
});

export const { useFetchPublicStationsQuery } = stationsApi;
