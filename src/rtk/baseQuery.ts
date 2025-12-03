import type { BaseQueryApi, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../config';
import { AuthTokens } from '../models/AuthTokens';

let refreshPromise: Promise<string | null> | null = null;

const doRefresh = async (api: BaseQueryApi, baseQuery: ReturnType<typeof fetchBaseQuery>): Promise<string | null> => {
  const res = await baseQuery({ url: '/auth/refresh', method: 'POST', body: {} }, api, {});

  if (res.error) {
    localStorage.removeItem('access_token');
    return null;
  }

  const data = res.data as AuthTokens;
  if (data?.accessToken) {
    localStorage.setItem('access_token', data.accessToken);
    return data.accessToken;
  }

  localStorage.removeItem('access_token');
  return null;
};

const ensureRefreshed = async (
  api: BaseQueryApi,
  baseQuery: ReturnType<typeof fetchBaseQuery>
): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = doRefresh(api, baseQuery).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

const performLogout = (): void => {
  localStorage.removeItem('access_token');
  // window.location.href = '/login';
};

export const createBaseQueryWithReAuth = (baseUrl: string = config.baseUrl) => {
  const baseQuery = fetchBaseQuery({
    baseUrl, // CHANGED: Use provided baseUrl
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      headers.set('Accept-Language', 'ro');

      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  });

  return async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: Record<string, unknown>) => {
    let result = await baseQuery(args, api, extraOptions);

    const error = result.error as FetchBaseQueryError | undefined;
    if (error?.status === 401) {
      const newAccessToken = await ensureRefreshed(api, baseQuery);

      if (newAccessToken) {
        result = await baseQuery(args, api, extraOptions);
      } else {
        performLogout();
      }
    }

    return result;
  };
};

export const baseQueryWithReAuth = createBaseQueryWithReAuth();
