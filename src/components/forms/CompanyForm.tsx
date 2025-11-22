import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Error } from '../../interfaces/error';
import {
  useCreateAdminCompanyMutation,
  useDeleteAdminCompanyMutation,
  useUpdateAdminCompanyMutation,
} from '../../rtk/services/admin-service';
import { showToast } from '../../utils/showToast';
import ConfirmationModal from '../shared/ConfirmationModal';
import { Button } from '../shared/Button';
import { useForm } from '../../hooks/useForm';
import { CustomInput } from '../shared/CustomInput';

interface CompanyFormProps {
  selectedCompany: Partial<CompanyFormValues> | null;
  onCloseDrawer: () => void;
}

type CompanyFormValues = {
  id?: string;
  name: string;
  shortName: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  street: string;
  streetNumber?: string;
  houseNumber?: string;
  zipcode?: string;
};

const initialValues: CompanyFormValues = {
  id: '',
  name: '',
  shortName: '',
  email: '',
  phoneNumber: '',
  country: '',
  city: '',
  street: '',
  streetNumber: '',
  houseNumber: '',
  zipcode: '',
};

const CompanyForm: FC<CompanyFormProps> = ({ selectedCompany, onCloseDrawer }) => {
  const { t } = useTranslation();

  const [createCompany, { isLoading: isCreating }] = useCreateAdminCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateAdminCompanyMutation();
  const [deleteCompany] = useDeleteAdminCompanyMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isEdit = Boolean(selectedCompany?.id);

  const { values, errors, register, handleSubmit, isSubmitting } = useForm<CompanyFormValues>({
    initialValues: {
      ...initialValues,
      ...(selectedCompany || {}),
      id: selectedCompany?.id ?? '',
    },
    fields: {
      name: {
        validate: (value) => {
          const v = String(value ?? '').trim();
          if (!v) return 'companyNameEmpty';
          return null;
        },
      },
      shortName: {
        validate: (value) => {
          const v = String(value ?? '').trim();
          if (!v) return 'companyShortNameEmpty';
          if (v.length > 15) return 'companyShortNameTooLong';
          return null;
        },
      },
      email: {
        validate: (value) => {
          const v = String(value ?? '').trim();
          if (!v) return 'companyEmailEmpty';
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(v)) return 'companyEmailInvalid';
          return null;
        },
      },
      phoneNumber: {
        validate: (value) => {
          const v = String(value ?? '').trim();
          if (!v) return 'companyPhoneEmpty';
          return null;
        },
      },
      country: {
        validate: (value) => {
          const v = String(value ?? '').trim();
          if (!v) return 'countryEmpty';
          return null;
        },
      },
      city: {
        validate: (value) => {
          const v = String(value ?? '').trim();
          if (!v) return 'cityEmpty';
          return null;
        },
      },
      street: {
        validate: (value) => {
          const v = String(value ?? '').trim();
          if (!v) return 'streetEmpty';
          return null;
        },
      },
    },
    onSubmit: async (formValues) => {
      const payload = {
        name: formValues.name,
        shortName: formValues.shortName,
        email: formValues.email,
        phoneNumber: formValues.phoneNumber,
        country: formValues.country,
        city: formValues.city,
        street: formValues.street,
        streetNumber: formValues.streetNumber,
        houseNumber: formValues.houseNumber,
        zipcode: formValues.zipcode,
      };

      try {
        if (isEdit && formValues.id) {
          await updateCompany({ companyId: formValues.id, ...payload }).unwrap();
          showToast(t('companyUpdateSuccess'), 'success');
        } else {
          await createCompany(payload).unwrap();
          showToast(t('companyCreateSuccess'), 'success');
        }
        onCloseDrawer();
      } catch (error) {
        showToast((error as Error).data?.message ?? t('companySaveError'), 'error');
      }
    },
  });

  const onSubmit = handleSubmit();

  const handleDelete = async () => {
    if (!values.id) return;

    try {
      await deleteCompany(values.id).unwrap();
      showToast(t('companyDeleteSuccess'), 'success');
      setShowDeleteModal(false);
      onCloseDrawer();
    } catch (error) {
      showToast((error as Error).data?.message ?? t('companyDeleteError'), 'error');
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            label={t('companyName')}
            {...register('name')}
            error={errors.name && t(errors.name)}
            wrapperClassName="mb-0 md:col-span-2"
          />

          <CustomInput
            label={`${t('companyShortName')} (${t('maxCharacters', { max: 15 })})`}
            {...register('shortName')}
            disabled={isEdit}
            maxLength={15}
            error={errors.shortName && t(errors.shortName)}
            className={isEdit ? 'bg-background/60 cursor-not-allowed' : ''}
            wrapperClassName="mb-1 md:col-span-2"
            placeholder={t('companyShortNamePlaceholder')}
          />
          {isEdit && (
            <p className="text-xs font-body text-text/60 md:col-span-2">{t('companyShortNameCannotBeChanged')}</p>
          )}

          <CustomInput
            label={t('email')}
            {...register('email')}
            error={errors.email && t(errors.email)}
            wrapperClassName="mb-0"
          />

          <CustomInput
            label={t('phoneNumber')}
            {...register('phoneNumber')}
            error={errors.phoneNumber && t(errors.phoneNumber)}
            wrapperClassName="mb-0"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            label={t('country')}
            {...register('country')}
            error={errors.country && t(errors.country)}
            wrapperClassName="mb-0"
          />

          <CustomInput
            label={t('city')}
            {...register('city')}
            error={errors.city && t(errors.city)}
            wrapperClassName="mb-0"
          />

          <CustomInput
            label={t('street')}
            {...register('street')}
            error={errors.street && t(errors.street)}
            wrapperClassName="mb-0 md:col-span-2"
          />

          <CustomInput label={t('streetNumber')} {...register('streetNumber')} wrapperClassName="mb-0" />

          <CustomInput label={t('houseNumber')} {...register('houseNumber')} wrapperClassName="mb-0" />

          <CustomInput label={t('zipcode')} {...register('zipcode')} wrapperClassName="mb-0 md:col-span-2" />
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
        message={t('areYouSureDeleteCompany')}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
};

export default CompanyForm;
