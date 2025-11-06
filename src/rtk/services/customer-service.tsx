import { createApi } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../../interfaces/customer.payload';
import { Customer } from '../../models/Customer';
import { UnsubscribeRequest, UnsubscribeResponse } from '../../models/Unsubscribe.ts';
import { baseQueryWithReAuth } from '../baseQuery.ts';

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Customer'],
  endpoints: (builder) => ({
    fetchCustomerById: builder.query({
      query: (id) => `${config.customersUrl}/${id}`,
    }),
    fetchAllCustomers: builder.query<Customer[], void>({
      query: () => config.customersUrl,
      providesTags: ['Customer'],
    }),
    createCustomer: builder.mutation<void, CreateCustomerDTO>({
      query: (newCustomer) => ({
        url: config.customersUrl,
        method: 'POST',
        body: newCustomer,
      }),
      invalidatesTags: ['Customer'],
    }),
    updateCustomer: builder.mutation<void, UpdateCustomerDTO>({
      query: ({ customerId, ...body }) => ({
        url: `${config.customersUrl}/${customerId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Customer'],
    }),
    deleteCustomer: builder.mutation<void, string>({
      query: (customerId) => ({
        url: `${config.customersUrl}/${customerId}`,
        method: 'DELETE',
        body: {},
      }),
      invalidatesTags: ['Customer'],
    }),
    unsubscribe: builder.mutation<UnsubscribeResponse, UnsubscribeRequest>({
      query: (data) => ({
        url: `${config.customersUrl}/unsubscribe`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchCustomerByIdQuery,
  useFetchAllCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useUnsubscribeMutation,
} = customerApi;
