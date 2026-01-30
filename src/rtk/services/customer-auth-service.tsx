import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';

// Auth endpoints use a plain base query without auto-injected tokens.
// OTP endpoints need no auth, and register uses a custom tempToken header.
const customerAuthBaseQuery = fetchBaseQuery({
  baseUrl: config.baseUrl,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json');
    headers.set('Accept-Language', 'ro');
    return headers;
  },
});

export interface RequestOtpPayload {
  phoneNumber: string;
}

export interface RequestOtpResponse {
  success: boolean;
  expiresIn: number;
}

export interface VerifyOtpPayload {
  phoneNumber: string;
  code: string;
}

export interface CustomerUser {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

export interface VerifyOtpResponse {
  accessToken?: string;
  tempToken?: string;
  isNewUser: boolean;
  phoneNumber?: string;
  user?: CustomerUser;
}

export interface CustomerRegisterPayload {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gdprConsent: boolean;
  tempToken: string;
}

export interface CustomerRegisterResponse {
  success: boolean;
  accessToken: string;
  user: CustomerUser;
}

export const customerAuthApi = createApi({
  reducerPath: 'customerAuthApi',
  baseQuery: customerAuthBaseQuery,
  endpoints: (builder) => ({
    requestOtp: builder.mutation<RequestOtpResponse, RequestOtpPayload>({
      query: (payload) => ({
        url: '/customer-portal/auth/request-otp',
        method: 'POST',
        body: payload,
      }),
    }),

    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpPayload>({
      query: (payload) => ({
        url: '/customer-portal/auth/verify-otp',
        method: 'POST',
        body: payload,
      }),
    }),

    customerRegister: builder.mutation<CustomerRegisterResponse, CustomerRegisterPayload>({
      query: ({ tempToken, ...body }) => ({
        url: '/customer-portal/auth/register',
        method: 'POST',
        body,
        headers: {
          Authorization: `Bearer ${tempToken}`,
        },
      }),
    }),
  }),
});

export const { useRequestOtpMutation, useVerifyOtpMutation, useCustomerRegisterMutation } = customerAuthApi;
