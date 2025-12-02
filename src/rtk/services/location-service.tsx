import { createApi } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { createBaseQueryWithReAuth } from '../baseQuery';

export interface County {
  id: string;
  code: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
  countyId: string;
}

export const locationApi = createApi({
  reducerPath: 'locationApi',
  baseQuery: createBaseQueryWithReAuth(config.baseUrl),
  tagTypes: ['Locations'],
  endpoints: (builder) => ({
    getCounties: builder.query<County[], void>({
      query: () => '/locations/counties',
      providesTags: ['Locations'],
    }),
    getCitiesByCounty: builder.query<City[], string>({
      query: (countyId) => `/locations/counties/${countyId}/cities`,
      providesTags: ['Locations'],
    }),
  }),
});

export const { useGetCountiesQuery, useGetCitiesByCountyQuery } = locationApi;

