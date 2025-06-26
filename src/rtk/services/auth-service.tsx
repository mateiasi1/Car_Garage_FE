import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { AuthTokens } from '../../models/AuthTokens';
import { Credentials } from '../../models/Credentials';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: config.baseUrl }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthTokens, Credentials>({
      query: (credentials) => ({
        url: config.loginUrl,
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
