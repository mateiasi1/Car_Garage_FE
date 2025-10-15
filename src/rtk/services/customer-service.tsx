import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { Customer } from '../../models/Customer';
import { prepareRequestHeaders } from '../../utils/prepareRequestHeaders';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../../interfaces/customer.payload';

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
      }),
      invalidatesTags: ['Customer'],
    }),
  }),
});

export const {
  useFetchCustomerByIdQuery,
  useFetchAllCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
