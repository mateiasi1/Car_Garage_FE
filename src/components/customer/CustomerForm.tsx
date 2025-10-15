import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../../interfaces/customer.payload';
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from '../../rtk/services/customer-service';
import { showToast } from '../../utils/showToast';
import { PrimaryButton } from '../shared/PrimaryButton';
import { DangerButton } from '../shared/DangerButton';
import ConfirmationModal from '../shared/ConfirmationModal';
import { Error } from '../../interfaces/error';

interface CustomerFormProps {
  selectedCustomer: Partial<CustomerFormState> | null;
  onCloseDrawer: () => void;
}

type CustomerFormState = {
  id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

const initialState: CustomerFormState = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
};

const CustomerForm: FC<CustomerFormProps> = ({ selectedCustomer, onCloseDrawer }) => {
  const { t } = useTranslation();
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isEdit = Boolean(selectedCustomer);

  const [form, setForm] = useState<CustomerFormState>({
    ...initialState,
    ...(selectedCustomer ?? {}),
  });

  useEffect(() => {
    if (selectedCustomer) {
      setForm((prev) => ({
        ...prev,
        ...selectedCustomer,
      }));
    } else {
      setForm({ ...initialState });
    }
  }, [selectedCustomer]);

  const inputBaseClass =
    'w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-primary';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!form.firstName?.trim()) {
      showToast(t('firstNameEmpty'), 'error');
      return false;
    }
    if (!form.lastName?.trim()) {
      showToast(t('lastNameEmpty'), 'error');
      return false;
    }
    if (!form.phoneNumber?.trim()) {
      showToast(t('phoneNumberEmpty'), 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEdit && form.id) {
        const payload: UpdateCustomerDTO = { customerId: form.id, ...form };
        await updateCustomer(payload).unwrap();
        showToast(t('customerUpdateSuccess'), 'success');
        onCloseDrawer();
      } else {
        const payload: CreateCustomerDTO = { ...form };
        await createCustomer(payload).unwrap();
        showToast(t('customerCreateSuccess'), 'success');
        onCloseDrawer();
      }
    } catch (error) {
      showToast((error as Error).data.message, 'error');
    }
  };

  const handleDelete = async () => {
    if (!form.id) return;
    try {
      await deleteCustomer(form.id).unwrap();
      showToast(t('customerDeleteSuccess'), 'success');
      setShowDeleteModal(false);
      onCloseDrawer();
    } catch (error) {
      showToast((error as Error).data.message, 'error');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">{t('lastName')}</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className={inputBaseClass}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">{t('firstName')}</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className={inputBaseClass}
            />
          </div>
          <div className="col-span-full">
            <label className="block font-semibold mb-1">{t('phoneNumber')}</label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className={inputBaseClass}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {isEdit && <DangerButton type="button" text={t('delete')} onClick={() => setShowDeleteModal(true)} />}
          <PrimaryButton type="submit" text={t('submit')} disabled={isCreating || isUpdating} />
        </div>
      </form>

      <ConfirmationModal
        open={showDeleteModal}
        title={t('areYouSure')}
        message={t('areYouSureDeleteCustomer')}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
};

export default CustomerForm;
