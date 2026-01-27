import { createApi } from '@reduxjs/toolkit/query/react';
import { customerBaseQuery } from '../customerBaseQuery';
import { CustomerProfile } from '../../models/CustomerProfile';
import { CustomerCar, CarDocument } from '../../models/CustomerCar';
import { CarReminder } from '../../models/CarReminder';
import {
  AddCustomerCarDTO,
  UpdateCustomerCarDTO,
  AddCarDocumentDTO,
  UpdateCarDocumentDTO,
  AddCarReminderDTO,
  UpdateCarReminderDTO,
  UpdateCustomerProfileDTO,
} from '../../interfaces/customer-portal.payload';

export interface DeadlineItem {
  id: string;
  carId: string;
  carLicensePlate: string;
  type: string;
  title?: string;
  expiresAt: string;
  daysUntilExpiry: number;
  isExpired: boolean;
}

export interface CustomerDashboardData {
  upcomingDeadlines: DeadlineItem[];
  carsCount: number;
  activeReminders: number;
  expiredDocuments: number;
}

export const customerProfileApi = createApi({
  reducerPath: 'customerProfileApi',
  baseQuery: customerBaseQuery,
  tagTypes: ['CustomerProfile', 'CustomerCars', 'CustomerDashboard', 'CustomerReminders'],
  endpoints: (builder) => ({
    // Profile endpoints
    fetchCustomerProfile: builder.query<CustomerProfile, void>({
      query: () => '/customer-portal/profile',
      providesTags: ['CustomerProfile'],
      transformResponse: (response: { profile: CustomerProfile }) => response.profile,
    }),

    updateCustomerProfile: builder.mutation<CustomerProfile, UpdateCustomerProfileDTO>({
      query: (data) => ({
        url: '/customer-portal/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['CustomerProfile'],
    }),

    // Dashboard endpoint
    fetchCustomerDashboard: builder.query<CustomerDashboardData, void>({
      query: () => '/customer-portal/dashboard',
      providesTags: ['CustomerDashboard'],
      transformResponse: (response: {
        stats: { totalCars: number; activeReminders: number; expiringSoon: number; expiredDocs: number };
        deadlines: Array<{
          id: string;
          type: string;
          documentType?: string;
          title: string;
          carLicensePlate: string;
          carId: string;
          expiresAt: string;
          daysUntilExpiry: number;
        }>;
      }) => ({
        carsCount: response.stats.totalCars,
        activeReminders: response.stats.activeReminders,
        expiredDocuments: response.stats.expiredDocs,
        upcomingDeadlines: response.deadlines.map((d) => ({
          id: d.id,
          carId: d.carId,
          carLicensePlate: d.carLicensePlate,
          type: d.documentType || d.type,
          title: d.title,
          expiresAt: d.expiresAt,
          daysUntilExpiry: d.daysUntilExpiry,
          isExpired: d.daysUntilExpiry < 0,
        })),
      }),
    }),

    // Cars endpoints
    fetchCustomerCars: builder.query<CustomerCar[], void>({
      query: () => '/customer-portal/cars',
      providesTags: ['CustomerCars'],
      transformResponse: (response: { cars: CustomerCar[] }) => response.cars,
    }),

    fetchCustomerCarById: builder.query<CustomerCar, string>({
      query: (carId) => `/customer-portal/cars/${carId}`,
      providesTags: (_result, _error, carId) => [{ type: 'CustomerCars', id: carId }],
      transformResponse: (response: { car: CustomerCar }) => response.car,
    }),

    addCustomerCar: builder.mutation<CustomerCar, AddCustomerCarDTO>({
      query: (data) => ({
        url: '/customer-portal/cars',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CustomerCars', 'CustomerDashboard'],
      transformResponse: (response: { car: CustomerCar }) => response.car,
    }),

    updateCustomerCar: builder.mutation<CustomerCar, { carId: string; data: UpdateCustomerCarDTO }>({
      query: ({ carId, data }) => ({
        url: `/customer-portal/cars/${carId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['CustomerCars', 'CustomerDashboard'],
      transformResponse: (response: { car: CustomerCar }) => response.car,
    }),

    deleteCustomerCar: builder.mutation<void, string>({
      query: (carId) => ({
        url: `/customer-portal/cars/${carId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CustomerCars', 'CustomerDashboard'],
    }),

    // Document endpoints
    addCarDocument: builder.mutation<CarDocument, AddCarDocumentDTO>({
      query: (data) => ({
        url: '/customer-portal/documents',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CustomerCars', 'CustomerDashboard'],
    }),

    updateCarDocument: builder.mutation<CarDocument, { documentId: string; data: UpdateCarDocumentDTO }>({
      query: ({ documentId, data }) => ({
        url: `/customer-portal/documents/${documentId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['CustomerCars', 'CustomerDashboard'],
    }),

    deleteCarDocument: builder.mutation<void, string>({
      query: (documentId) => ({
        url: `/customer-portal/documents/${documentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CustomerCars', 'CustomerDashboard'],
    }),

    // Reminder endpoints
    fetchCustomerReminders: builder.query<CarReminder[], void>({
      query: () => '/customer-portal/reminders',
      providesTags: ['CustomerReminders'],
    }),

    addCarReminder: builder.mutation<CarReminder, AddCarReminderDTO>({
      query: (data) => ({
        url: '/customer-portal/reminders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CustomerReminders', 'CustomerCars', 'CustomerDashboard'],
    }),

    updateCarReminder: builder.mutation<CarReminder, { reminderId: string; data: UpdateCarReminderDTO }>({
      query: ({ reminderId, data }) => ({
        url: `/customer-portal/reminders/${reminderId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['CustomerReminders', 'CustomerCars', 'CustomerDashboard'],
    }),

    deleteCarReminder: builder.mutation<void, string>({
      query: (reminderId) => ({
        url: `/customer-portal/reminders/${reminderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CustomerReminders', 'CustomerCars', 'CustomerDashboard'],
    }),
  }),
});

export const {
  useFetchCustomerProfileQuery,
  useUpdateCustomerProfileMutation,
  useFetchCustomerDashboardQuery,
  useFetchCustomerCarsQuery,
  useFetchCustomerCarByIdQuery,
  useAddCustomerCarMutation,
  useUpdateCustomerCarMutation,
  useDeleteCustomerCarMutation,
  useAddCarDocumentMutation,
  useUpdateCarDocumentMutation,
  useDeleteCarDocumentMutation,
  useFetchCustomerRemindersQuery,
  useAddCarReminderMutation,
  useUpdateCarReminderMutation,
  useDeleteCarReminderMutation,
} = customerProfileApi;
