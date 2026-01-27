import { createApi } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { publicBaseQuery } from '../publicBaseQuery';

export interface CarMakeModel {
  id: string;
  make: string;
  model: string;
  isApproved: boolean;
  approvalCount: number;
}

export interface VotePayload {
  make: string;
  model: string;
  userId: string;
  inspectionId: string;
}

export const carMakesModelsApi = createApi({
  reducerPath: 'carMakesModelsApi',
  baseQuery: publicBaseQuery,
  tagTypes: ['CarMakesModels'],
  endpoints: (builder) => ({
    fetchMakes: builder.query<string[], void>({
      query: () => `${config.carMakesModelsUrl}/makes`,
      providesTags: ['CarMakesModels'],
      transformResponse: (response: string[]) => {
        // Ensure unique makes (deduplicate in case of caching issues)
        return [...new Set(response)];
      },
    }),
    fetchModelsForMake: builder.query<string[], string>({
      query: (make) => `${config.carMakesModelsUrl}/models?make=${encodeURIComponent(make)}`,
      providesTags: ['CarMakesModels'],
    }),
    voteCarMakeModel: builder.mutation<void, VotePayload>({
      query: (payload) => ({
        url: `${config.carMakesModelsUrl}/vote`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['CarMakesModels'],
    }),
  }),
});

export const { useFetchMakesQuery, useFetchModelsForMakeQuery, useVoteCarMakeModelMutation } =
  carMakesModelsApi;
