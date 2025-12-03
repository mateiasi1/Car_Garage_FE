import { FC, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Error } from '../../interfaces/error';
import {
  useCreateAdminCompanyMutation,
  useDeleteAdminCompanyMutation,
  useUpdateAdminCompanyMutation,
} from '../../rtk/services/admin-service';
import { useGetCountiesQuery, useGetCitiesByCountyQuery } from '../../rtk/services/location-service';
import { showToast } from '../../utils/showToast';
import ConfirmationModal from '../shared/ConfirmationModal';
import { Button } from '../shared/Button';
import { useForm } from '../../hooks/useForm';
import { CustomInput } from '../shared/CustomInput';
import { PhoneNumberRoInput } from '../PhoneNumberRoInput';
import { CustomSelect } from '../shared/CustomSelect';
import { Company } from '../../models/Company';

interface CompanyFormProps {
  selectedCompany: Partial<Company> | null;
  onCloseDrawer: () => void;
}

type CompanyFormValues = {
  id?: string;
  name: string;
  shortName: string;
  email: string;
  phoneNumber: string;
  country: string;
  countyId: string;
  cityId: string;
  street: string;
  streetNumber?: string;
  houseNumber?: string;
  zipcode?: string;
  isDemo: boolean;
};

const CompanyForm: FC<CompanyFormProps> = ({ selectedCompany, onCloseDrawer }) => {
  const { t } = useTranslation();

  const [createCompany, { isLoading: isCreating }] = useCreateAdminCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateAdminCompanyMutation();
  const [deleteCompany] = useDeleteAdminCompanyMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isEdit = Boolean(selectedCompany?.id);

  // Extract countyId and cityId from selectedCompany.cityRef
  const initialCountyId = selectedCompany?.cityRef?.county?.id ?? '';
  const initialCityId = selectedCompany?.cityId ?? '';

  const { values, errors, register, handleSubmit, isSubmitting, setFieldValue } = useForm<CompanyFormValues>({
    initialValues: {
      id: selectedCompany?.id ?? '',
      name: selectedCompany?.name ?? '',
      shortName: selectedCompany?.shortName ?? '',
      email: selectedCompany?.email ?? '',
      phoneNumber: selectedCompany?.phoneNumber ?? '',
      country: selectedCompany?.country ?? 'România',
      countyId: initialCountyId,
      cityId: initialCityId,
      street: selectedCompany?.street ?? '',
      streetNumber: selectedCompany?.streetNumber ?? '',
      houseNumber: selectedCompany?.houseNumber ?? '',
      zipcode: selectedCompany?.zipcode ?? '',
      isDemo: (selectedCompany as Partial<Company> & { isDemo?: boolean })?.isDemo ?? false,
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
      countyId: {
        validate: (value) => {
          const v = String(value ?? '').trim();
          if (!v) return 'countyEmpty';
          return null;
        },
      },
      cityId: {
        validate: (value) => {
          const v = String(value ?? '').trim();
          if (!v) return 'cityEmpty';
          return null;
        },
      },
      country: {
        validate: () => null,
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
        cityId: formValues.cityId,
        street: formValues.street,
        streetNumber: formValues.streetNumber,
        houseNumber: formValues.houseNumber,
        zipcode: formValues.zipcode,
        isDemo: formValues.isDemo,
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

  // Fetch counties from API
  const { data: counties = [], isLoading: isLoadingCounties } = useGetCountiesQuery();

  // Fetch cities for selected county
  const { data: cities = [], isLoading: isLoadingCities } = useGetCitiesByCountyQuery(values.countyId, {
    skip: !values.countyId,
  });

  // County options for dropdown
  const countyOptions = useMemo(() => counties.map((c) => ({ value: c.id, label: c.name })), [counties]);

  // City options for dropdown
  const cityOptions = useMemo(() => cities.map((c) => ({ value: c.id, label: c.name })), [cities]);

  // Reset city when county changes
  const handleCountyChange = (countyId: string) => {
    setFieldValue('countyId', countyId);
    setFieldValue('cityId', '');
  };

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

          <div className="mb-0">
            <PhoneNumberRoInput
              label={t('phoneNumber')}
              value={values.phoneNumber}
              onChange={(val) => setFieldValue('phoneNumber', val)}
              error={errors.phoneNumber && t(errors.phoneNumber)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput label={t('country')} value={values.country} disabled wrapperClassName="mb-0" />

          <CustomSelect
            label={t('county')}
            value={values.countyId}
            onChange={handleCountyChange}
            options={countyOptions}
            searchable
            placeholder={isLoadingCounties ? t('loading') : t('selectCounty')}
            disabled={isLoadingCounties}
            error={errors.countyId && t(errors.countyId)}
            wrapperClassName="mb-0"
          />

          <CustomSelect
            label={t('city')}
            value={values.cityId}
            onChange={(val) => setFieldValue('cityId', val)}
            options={cityOptions}
            searchable
            placeholder={!values.countyId ? t('selectCountyFirst') : isLoadingCities ? t('loading') : t('selectCity')}
            disabled={!values.countyId || isLoadingCities}
            error={errors.cityId && t(errors.cityId)}
            wrapperClassName="mb-0"
          />

          <CustomInput
            label={t('street')}
            {...register('street')}
            error={errors.street && t(errors.street)}
            wrapperClassName="mb-0"
          />

          <CustomInput label={t('streetNumber')} {...register('streetNumber')} wrapperClassName="mb-0" />

          <CustomInput label={t('houseNumber')} {...register('houseNumber')} wrapperClassName="mb-0" />

          <CustomInput label={t('zipcode')} {...register('zipcode')} wrapperClassName="mb-0 md:col-span-2" />
        </div>

        {/* Demo checkbox - only for admin */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="isDemo"
            checked={values.isDemo}
            onChange={(e) => setFieldValue('isDemo', e.target.checked)}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
          />
          <label htmlFor="isDemo" className="text-sm font-body text-text">
            {t('isDemo')}
          </label>
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
