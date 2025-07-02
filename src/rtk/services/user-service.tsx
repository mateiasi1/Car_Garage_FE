import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { User } from '../../models/User';
import { prepareRequestHeaders } from '../../utils/prepareRequestHeaders';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseUrl,
    prepareHeaders: prepareRequestHeaders,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    fetchUserProfile: builder.query<User, void>({
      query: () => config.userProfileUrl,
    }),
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

export const { useFetchUserProfileQuery, useFetchUserByIdQuery, useFetchAllUsersQuery, useCreateUserMutation } =
  userApi;
