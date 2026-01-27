import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from '../baseQuery';

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
  tempToken: string;
}

export interface CustomerRegisterResponse {
  success: boolean;
  accessToken: string;
  user: CustomerUser;
}

export const customerAuthApi = createApi({
  reducerPath: 'customerAuthApi',
  baseQuery: baseQueryWithReAuth,
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
