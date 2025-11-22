import { createApi } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { baseQueryWithReAuth } from '../baseQuery';

export interface LoginPayload {
  username: string;
  password: string;
  branchId?: string;
}

export interface LoginResponse {
  accessToken?: string;
  selectBranch?: boolean;
  branches?: { id: string; name: string }[];
  canAddBranch?: boolean;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (credentials) => ({
        url: config.loginUrl,
        method: 'POST',
        body: credentials,
      }),
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
        body: {},
      }),
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        body: {},
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation, useLogoutMutation } = authApi;
