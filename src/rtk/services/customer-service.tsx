import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { Customer } from '../../models/Customer';
import { prepareRequestHeaders } from '../../utils/prepareRequestHeaders';

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseUrl,
    prepareHeaders: (headers, { arg }) => prepareRequestHeaders(headers, arg),
    credentials: 'include',
  }),
  tagTypes: ['Customer'],
  endpoints: (builder) => ({
    fetchCustomerById: builder.query({
      query: (id) => `/customer/${id}`,
    }),
    fetchAllCustomers: builder.query<Customer[], void>({
      query: () => config.customersUrl,
    }),
    createCustomer: builder.mutation({
      query: (customer) => ({
        url: '/customer',
        method: 'POST',
        body: customer,
      }),
    }),
  }),
});

export const { useFetchCustomerByIdQuery, useFetchAllCustomersQuery, useCreateCustomerMutation } = customerApi;
