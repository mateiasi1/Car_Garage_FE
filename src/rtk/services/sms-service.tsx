import { createApi } from '@reduxjs/toolkit/query/react';
import { SendInspectionReminderResponse } from '../../models/SmsService.ts';
import {baseQueryWithReAuth} from "../baseQuery.ts";

export const smsApi = createApi({
    reducerPath: 'smsApi',
    baseQuery: baseQueryWithReAuth,
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