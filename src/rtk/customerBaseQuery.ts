import type { BaseQueryApi, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../config';
import { customerSession } from '../utils/customerSession';

const CUSTOMER_TOKEN_KEY = 'customer_access_token';

const performCustomerLogout = (): void => {
  customerSession.clear();
  window.location.href = '/customer/login';
};

export const createCustomerBaseQuery = (baseUrl: string = config.baseUrl) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      headers.set('Accept-Language', 'ro');

      // Use customer-specific token
      const token = localStorage.getItem(CUSTOMER_TOKEN_KEY);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  });

  return async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: Record<string, unknown>) => {
    const result = await baseQuery(args, api, extraOptions);

    const error = result.error as FetchBaseQueryError | undefined;
    if (error?.status === 401) {
      // Customer tokens don't refresh - redirect to login
      performCustomerLogout();
    }

    return result;
  };
};

export const customerBaseQuery = createCustomerBaseQuery();
