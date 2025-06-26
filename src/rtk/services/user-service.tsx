import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}` }),
  endpoints: (builder) => ({
    fetchUserById: builder.query({
      query: (id) => `/users/${id}`,
    }),
    fetchAllUsers: builder.query({
      query: () => `/users`,
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: '/user',
        method: 'POST',
        body: user,
      }),
    }),
  }),
});

export const { useFetchUserByIdQuery, useFetchAllUsersQuery, useCreateUserMutation } = userApi;
