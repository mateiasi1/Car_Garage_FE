import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../../interfaces/customer.payload';
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from '../../rtk/services/customer-service';
import { showToast } from '../../utils/showToast';
import ConfirmationModal from '../shared/ConfirmationModal';
import { Error } from '../../interfaces/error';
import { PhoneNumberRoInput } from '../PhoneNumberRoInput';
import { Button } from '../shared/Button';
import { useForm } from '../../hooks/useForm';
import { CustomInput } from '../shared/CustomInput';

interface CustomerFormProps {
  selectedCustomer: {
    id?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  } | null;
  onCloseDrawer: () => void;
}

type CustomerFormValues = {
  id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

const CustomerForm: FC<CustomerFormProps> = ({ selectedCustomer, onCloseDrawer }) => {
  const { t } = useTranslation();
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isEdit = Boolean(selectedCustomer?.id);

  const { values, errors, register, handleSubmit, setFieldValue, isSubmitting } = useForm<CustomerFormValues>({
    initialValues: {
      id: selectedCustomer?.id ?? '',
      firstName: selectedCustomer?.firstName ?? '',
      lastName: selectedCustomer?.lastName ?? '',
      phoneNumber: selectedCustomer?.phoneNumber ?? '',
    },
    fields: {
      firstName: { required: true },
      lastName: { required: true },
      phoneNumber: {
        validate: (value) => {
          const val = String(value ?? '').trim();
          if (!val) return 'phoneNumberEmpty';
          return null;
        },
      },
    },
    onSubmit: async (formValues) => {
      try {
        if (isEdit && formValues.id) {
          const payload: UpdateCustomerDTO = {
            customerId: formValues.id,
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            phoneNumber: formValues.phoneNumber,
          };
          await updateCustomer(payload).unwrap();
          showToast(t('customerUpdateSuccess'), 'success');
        } else {
          const payload: CreateCustomerDTO = {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            phoneNumber: formValues.phoneNumber,
          };
          await createCustomer(payload).unwrap();
          showToast(t('customerCreateSuccess'), 'success');
        }
        onCloseDrawer();
      } catch (error) {
        const err = error as Error;
        if (err?.data?.message) {
          showToast(err.data.message, 'error');
        } else {
          showToast(t('unknownError'), 'error');
        }
      }
    },
  });

  const onDelete = async () => {
    if (!values.id) return;
    try {
      await deleteCustomer(values.id).unwrap();
      showToast(t('customerDeleteSuccess'), 'success');
      setShowDeleteModal(false);
      onCloseDrawer();
    } catch (error) {
      const err = error as Error;
      if (err?.data?.message) {
        showToast(err.data.message, 'error');
      } else {
        showToast(t('unknownError'), 'error');
      }
    }
  };

  const onSubmit = handleSubmit();

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            label={t('lastName')}
            {...register('lastName')}
            error={errors.lastName && t(errors.lastName)}
            wrapperClassName="mb-0"
          />
          <CustomInput
            label={t('firstName')}
            {...register('firstName')}
            error={errors.firstName && t(errors.firstName)}
            wrapperClassName="mb-0"
          />
        </div>

        <div>
          <label className="block text-text text-sm font-semibold font-body mb-2">{t('phoneNumber')}</label>
          <PhoneNumberRoInput value={values.phoneNumber} onChange={(val) => setFieldValue('phoneNumber', val)} />
          {errors.phoneNumber && <p className="text-error text-sm mt-1 font-body">{t(errors.phoneNumber)}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {isEdit && (
            <Button type="button" variant="danger" size="md" className="w-1/3" onClick={() => setShowDeleteModal(true)}>
              {t('delete')}
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="md"
            className={isEdit ? 'w-2/3' : 'w-full'}
            loading={isCreating || isUpdating || isSubmitting}
          >
            {t('submit')}
          </Button>
        </div>
      </form>

      <ConfirmationModal
        open={showDeleteModal}
        title={t('areYouSure')}
        message={t('areYouSureDeleteCustomer')}
        onConfirm={onDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
};

export default CustomerForm;
