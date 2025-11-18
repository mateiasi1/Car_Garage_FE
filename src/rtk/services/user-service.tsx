import { createApi } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { User } from '../../models/User';
import ChangePasswordDTO from '../../dto/ChangePasswordDTO';
import {baseQueryWithReAuth} from "../baseQuery.ts";

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReAuth,
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
    generateUsername: builder.mutation<{ username: string }, { firstName: string; lastName: string }>({
      query: ({ firstName, lastName }) => ({
          url: `${config.usersUrl}/generate-username`,
          method: 'GET',
          params: { firstName, lastName },
      }),
    }),
      switchBranch: builder.mutation<{ accessToken: string }, { branchId: string }>({
          query: (body) => ({
              url: `${config.usersUrl}/switch-branch`,
              method: 'POST',
              body,
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
  useGenerateUsernameMutation,
  useSwitchBranchMutation,
  util: { invalidateTags },
} = userApi;
