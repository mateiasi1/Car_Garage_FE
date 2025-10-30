import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { prepareRequestHeaders } from '../../utils/prepareRequestHeaders';
import { SendInspectionReminderResponse } from '../../models/SmsService.ts';

export const smsApi = createApi({
    reducerPath: 'smsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config.baseUrl,
        prepareHeaders: (headers, { arg }) => prepareRequestHeaders(headers, arg),
        credentials: 'include',
    }),
    tagTypes: ['SMS'],
    endpoints: (builder) => ({
        sendInspectionReminder: builder.mutation<
            SendInspectionReminderResponse,
            string
        >({
            query: (inspectionId) => ({
                url: `/sms/inspection-reminder/${inspectionId}`,
                method: 'POST',
                body: {},
            }),
        }),
    }),
});

export const { useSendInspectionReminderMutation } = smsApi;