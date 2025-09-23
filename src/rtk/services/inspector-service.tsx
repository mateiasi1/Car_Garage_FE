import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { User } from '../../models/User';
import { prepareRequestHeaders } from '../../utils/prepareRequestHeaders';

export const inspectorApi = createApi({
  reducerPath: 'inspectorApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseUrl,
    prepareHeaders: prepareRequestHeaders,
    credentials: 'include',
  }),
  tagTypes: ['Inspector'],
  endpoints: (builder) => ({
    fetchInspectors: builder.query<User[], void>({
      query: () => config.inspectorsUrl,
      providesTags: ['Inspector'],
    }),
  }),
});

export const { useFetchInspectorsQuery } = inspectorApi;