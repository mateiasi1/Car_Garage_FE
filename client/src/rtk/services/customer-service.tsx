import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const customerApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:5000" }),
  endpoints: (builder) => ({
    fetchCustomerById: builder.query({
      query: (id) => `/customer/${id}`,
    }),
    fetchAllCustomers: builder.query({
      query: () => `/customers`,
    }),
    createCustomer: builder.mutation({
      query: (customer) => ({
        url: "/customer",
        method: "POST",
        body: customer,
      }),
    }),
  }),
});

export const { useFetchCustomerByIdQuery, useFetchAllCustomersQuery, useCreateCustomerMutation } = customerApi;