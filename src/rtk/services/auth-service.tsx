import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';

export interface LoginPayload {
  username: string;
  password: string;
  companyId?: string;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  selectCompany?: boolean;
  companies?: { id: string; name: string }[];
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: config.baseUrl }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (credentials) => ({
        url: config.loginUrl,
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
