import { createApi } from '@reduxjs/toolkit/query/react';
import { SendInspectionReminderResponse } from '../../models/SmsService';
import { baseQueryWithReAuth } from '../baseQuery';

export const smsApi = createApi({
  reducerPath: 'smsApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['SMS'],
  endpoints: (builder) => ({
    sendInspectionReminder: builder.mutation<SendInspectionReminderResponse, string>({
      query: (inspectionId) => ({
        url: `/sms/inspection-reminder/${inspectionId}`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: ['SMS'],
    }),
  }),
});

export const { useSendInspectionReminderMutation } = smsApi;
