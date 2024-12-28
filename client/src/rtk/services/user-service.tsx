import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:5000" }),
  endpoints: (builder) => ({
    fetchUserById: builder.query({
      query: (id) => `/user/${id}`,
    }),
    fetchAllUsers: builder.query({
      query: () => `/users`,
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: "/user",
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export const { useFetchUserByIdQuery, useFetchAllUsersQuery, useCreateUserMutation } = userApi;