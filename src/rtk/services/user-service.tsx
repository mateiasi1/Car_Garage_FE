import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { User } from '../../models/User';
import { prepareRequestHeaders } from '../../utils/prepareRequestHeaders';
import ChangePasswordDTO from '../../dto/ChangePasswordDTO';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseUrl,
    prepareHeaders: (headers, { arg }) => prepareRequestHeaders(headers, arg),
    credentials: 'include',
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    fetchUserProfile: builder.query<User, void>({
      query: () => config.userProfileUrl,
      providesTags: ['User'],
    }),
    updateUserProfile: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: config.userProfileUrl,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    fetchUserById: builder.query({
      query: (id) => `${config.usersUrl}/${id}`,
    }),
    fetchAllUsers: builder.query({
      query: () => config.usersUrl,
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: config.usersUrl,
        method: 'POST',
        body: user,
      }),
    }),
    changePassword: builder.mutation<void, ChangePasswordDTO>({
      query: (passwordData) => ({
        url: config.changePasswordUrl,
        method: 'PUT',
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useFetchUserProfileQuery,
  useFetchUserByIdQuery,
  useFetchAllUsersQuery,
  useCreateUserMutation,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  util: { invalidateTags },
} = userApi;
