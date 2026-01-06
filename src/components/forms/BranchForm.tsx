import { FC, useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCreateAdminBranchMutation,
  useUpdateAdminBranchMutation,
  useDeleteAdminBranchMutation,
} from '../../rtk/services/admin-service';
import {
  useCreateBranchMutation as useOwnerCreateBranchMutation,
  useUpdateBranchMutation as useOwnerUpdateBranchMutation,
  useDeleteBranchMutation as useOwnerDeleteBranchMutation,
} from '../../rtk/services/branch-service';
import { useGetCountiesQuery, useGetCitiesByCountyQuery } from '../../rtk/services/location-service';
import { Branch } from '../../models/Branch';
import { getErrorMessage } from '../../interfaces/error';
import { showToast } from '../../utils/showToast';
import ConfirmationModal from '../shared/ConfirmationModal';
import { Button } from '../shared/Button';
import { useForm } from '../../hooks/useForm';
import { CustomInput } from '../shared/CustomInput';
import { PhoneNumberRoInput } from '../PhoneNumberRoInput';
import { CustomSelect } from '../shared/CustomSelect';
import { MapPicker, AddressComponents, geocodeAddress } from '../shared/MapPicker';

interface BranchFormProps {
  selectedBranch: Branch | null;
  companyId?: string;
  onCloseDrawer: () => void;
  isOwnerMode?: boolean;
}

type BranchFormValues = {
  id?: string;
  name: string;
  phoneNumber: string;
  country: string;
  countyId: string;
  cityId: string;
  street: string;
  streetNumber?: string;
  houseNumber?: string;
  zipcode?: string;
  latitude?: number;
  longitude?: number;
  isDemo: boolean;
};

const initialValues: BranchFormValues = {
  id: '',
  name: '',
  phoneNumber: '',
  country: 'România',
  countyId: '',
  cityId: '',
  street: '',
  streetNumber: '',
  houseNumber: '',
  zipcode: '',
  latitude: undefined,
  longitude: undefined,
  isDemo: false,
};

const BranchForm: FC<BranchFormProps> = ({ selectedBranch, companyId, onCloseDrawer, isOwnerMode }) => {
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingWarning, setGeocodingWarning] = useState<string | null>(null);
  const [pendingCityName, setPendingCityName] = useState<string | null>(null);

  const isEdit = Boolean(selectedBranch?.id);
  const isOwner = Boolean(isOwnerMode);

  // Mutations ADMIN
  const [createAdminBranch, { isLoading: isCreatingAdmin }] = useCreateAdminBranchMutation();
  const [updateAdminBranch, { isLoading: isUpdatingAdmin }] = useUpdateAdminBranchMutation();
  const [deleteAdminBranch] = useDeleteAdminBranchMutation();

  // Mutations OWNER
  const [createOwnerBranch, { isLoading: isCreatingOwner }] = useOwnerCreateBranchMutation();
  const [updateOwnerBranch, { isLoading: isUpdatingOwner }] = useOwnerUpdateBranchMutation();
  const [deleteOwnerBranch] = useOwnerDeleteBranchMutation();

  const initialCountyId = selectedBranch?.cityRef?.county?.id ?? '';
  const initialCityId = selectedBranch?.cityId ?? '';

  const { values, errors, register, handleSubmit, isSubmitting, setFieldValue } = useForm<BranchFormValues>({
    initialValues: selectedBranch
      ? {
          id: selectedBranch.id,
          name: selectedBranch.name,
          phoneNumber: selectedBranch.phoneNumber ?? '',
          country: selectedBranch.country || 'România',
          countyId: initialCountyId,
          cityId: initialCityId,
          street: selectedBranch.street,
          streetNumber: selectedBranch.streetNumber ?? '',
          houseNumber: selectedBranch.houseNumber ?? '',
          zipcode: selectedBranch.zipcode ?? '',
          latitude: selectedBranch.latitude,
          longitude: selectedBranch.longitude,
          isDemo: (selectedBranch as Partial<Branch> & { isDemo?: boolean })?.isDemo ?? false,
        }
      : initialValues,
    fields: {
      name: {
        validate: (v) => (!String(v ?? '').trim() ? 'branch.branchNameEmpty' : null),
      },
      phoneNumber: {
        validate: (v) => (!String(v ?? '').trim() ? 'branch.branchPhoneEmpty' : null),
      },
      countyId: {
        validate: (v) => (!String(v ?? '').trim() ? 'countyEmpty' : null),
      },
      cityId: {
        validate: (v) => (!String(v ?? '').trim() ? 'cityEmpty' : null),
      },
      country: { validate: () => null },
      street: {
        validate: (v) => (!String(v ?? '').trim() ? 'streetEmpty' : null),
      },
    },
    onSubmit: async (formValues) => {
      const payload = {
        name: formValues.name,
        phoneNumber: formValues.phoneNumber,
        country: formValues.country,
        cityId: formValues.cityId,
        street: formValues.street,
        streetNumber: formValues.streetNumber,
        houseNumber: formValues.houseNumber,
        zipcode: formValues.zipcode,
        latitude: formValues.latitude,
        longitude: formValues.longitude,
        ...(!isOwner && { isDemo: formValues.isDemo }),
      };

      try {
        if (isOwner) {
          if (isEdit && formValues.id) {
            await updateOwnerBranch({ branchId: formValues.id, ...payload }).unwrap();
          } else {
            await createOwnerBranch(payload).unwrap();
          }
        } else {
          if (isEdit && formValues.id) {
            await updateAdminBranch({ companyId: companyId as string, branchId: formValues.id, ...payload }).unwrap();
          } else {
            await createAdminBranch({ companyId: companyId as string, data: payload }).unwrap();
          }
        }
        showToast(t(isEdit ? 'branch.branchUpdateSuccess' : 'branch.branchCreateSuccess'), 'success');
        onCloseDrawer();
      } catch (error) {
        showToast(getErrorMessage(error, t('branch.branchSaveError')), 'error');
      }
    },
  });

  const onSubmit = handleSubmit();
  const isSaving = isSubmitting || (isOwner ? isCreatingOwner || isUpdatingOwner : isCreatingAdmin || isUpdatingAdmin);

  // Location data
  const { data: counties = [], isLoading: isLoadingCounties } = useGetCountiesQuery();
  const { data: cities = [], isLoading: isLoadingCities } = useGetCitiesByCountyQuery(values.countyId, {
    skip: !values.countyId,
  });

  const countyOptions = useMemo(() => counties.map((c) => ({ value: c.id, label: c.name })), [counties]);
  const cityOptions = useMemo(() => cities.map((c) => ({ value: c.id, label: c.name })), [cities]);

  // Auto-set city after cities list loads (when county was set from map)
  useEffect(() => {
    if (pendingCityName && cities.length > 0 && !values.cityId) {
      const city = cities.find((c) => c.name.toLowerCase() === pendingCityName.toLowerCase());
      if (city) {
        setFieldValue('cityId', city.id);
        setPendingCityName(null); // Clear pending state
      }
    }
  }, [cities, pendingCityName, values.cityId, setFieldValue]);

  // Handlers
  const handleCountyChange = (countyId: string) => {
    setFieldValue('countyId', countyId);
    setFieldValue('cityId', '');
  };

  const handleFindOnMap = async () => {
    const county = counties.find((c) => c.id === values.countyId);
    const city = cities.find((c) => c.id === values.cityId);

    if (!city) {
      showToast(t('cityEmpty'), 'error');
      return;
    }

    setIsGeocoding(true);
    setGeocodingWarning(null);

    try {
      const result = await geocodeAddress(county?.name, city.name, values.street, values.streetNumber, values.zipcode);

      if (result) {
        setFieldValue('latitude', result.lat);
        setFieldValue('longitude', result.lon);

        if (result.accuracy === 'exact') {
          showToast(t('geocodingSuccessExact'), 'success');
          setGeocodingWarning(null);
        } else if (result.accuracy === 'street') {
          showToast(t('geocodingSuccessStreet'), 'success');
          setGeocodingWarning(t('geocodingWarningStreet'));
        } else {
          showToast(t('geocodingWarningCity'), 'info');
          setGeocodingWarning(t('geocodingWarningCityShort'));
        }
      } else {
        showToast(t('geocodingNotFound'), 'info');
        setGeocodingWarning(t('geocodingWarningNotFound'));
      }
    } catch {
      showToast(t('geocodingError'), 'error');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleMapChange = (lat: number, lng: number, address?: AddressComponents) => {
    setFieldValue('latitude', lat);
    setFieldValue('longitude', lng);

    if (!address) return;

    // Fill only empty fields
    if (!values.countyId && address.county) {
      const county = counties.find((c) => c.name.toLowerCase() === address.county?.toLowerCase());
      if (county) {
        setFieldValue('countyId', county.id);
        // Save city name to be set after cities load
        if (address.city) {
          setPendingCityName(address.city);
        }
      }
    }

    // Keep the city lookup for when county is already set
    if (values.countyId && !values.cityId && address.city) {
      const city = cities.find((c) => c.name.toLowerCase() === address.city?.toLowerCase());
      if (city) {
        setFieldValue('cityId', city.id);
      }
    }

    if (!values.street && address.street) {
      setFieldValue('street', address.street);
    }

    if (!values.streetNumber && address.streetNumber) {
      setFieldValue('streetNumber', address.streetNumber);
    }
  };

  const handleDelete = async () => {
    if (!values.id) return;

    try {
      if (isOwner) {
        await deleteOwnerBranch(values.id).unwrap();
      } else {
        await deleteAdminBranch({ companyId: companyId as string, branchId: values.id }).unwrap();
      }
      showToast(t('branch.branchDeleteSuccess'), 'success');
      setShowDeleteModal(false);
      onCloseDrawer();
    } catch (error) {
      showToast(getErrorMessage(error, t('branch.branchDeleteError')), 'error');
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        {/* Name & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            label={t('branch.branchName')}
            {...register('name')}
            error={errors.name && t(errors.name)}
            wrapperClassName="mb-0 md:col-span-2"
            isRequired
          />
          <div className="mb-0 md:col-span-2">
            <PhoneNumberRoInput
              label={t('phoneNumber')}
              value={values.phoneNumber}
              onChange={(val) => setFieldValue('phoneNumber', val)}
              error={errors.phoneNumber ? t(errors.phoneNumber) : undefined}
              isRequired
            />
          </div>
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput label={t('country')} value={values.country} disabled wrapperClassName="mb-0" isRequired />

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
            isRequired
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
            isRequired
          />

          <CustomInput
            label={t('street')}
            {...register('street')}
            error={errors.street && t(errors.street)}
            wrapperClassName="mb-0"
            isRequired
          />

          <CustomInput label={t('streetNumber')} {...register('streetNumber')} wrapperClassName="mb-0" />
          <CustomInput label={t('houseNumber')} {...register('houseNumber')} wrapperClassName="mb-0" />
          <CustomInput label={t('zipcode')} {...register('zipcode')} wrapperClassName="mb-0 md:col-span-2" />
        </div>

        {/* Map */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <h3 className="text-sm font-semibold text-text">{t('locationCoordinates')}</h3>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleFindOnMap}
              loading={isGeocoding}
              disabled={!values.countyId || !values.cityId || !values.street}
              className="w-full md:w-auto"
            >
              📍 {t('findOnMap')}
            </Button>
          </div>

          {geocodingWarning && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <span className="text-yellow-600 text-sm">{geocodingWarning}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomInput label={t('latitude')} value={values.latitude?.toString() ?? ''} disabled wrapperClassName="mb-0" placeholder="--" />
            <CustomInput label={t('longitude')} value={values.longitude?.toString() ?? ''} disabled wrapperClassName="mb-0" placeholder="--" />
          </div>

          <MapPicker
            latitude={values.latitude}
            longitude={values.longitude}
            onChange={handleMapChange}
            label={t('mapSelectLocation')}
          />
        </div>

        {/* Demo checkbox - admin only */}
        {!isOwner && (
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
        )}

        <div className="flex justify-end gap-3 pt-2">
          {isEdit && (
            <Button type="button" variant="danger" size="md" className="w-1/3" onClick={() => setShowDeleteModal(true)}>
              {t('delete')}
            </Button>
          )}
          <Button type="submit" variant="primary" size="md" className={isEdit ? 'w-2/3' : 'w-full'} loading={isSaving}>
            {t('submit')}
          </Button>
        </div>
      </form>

      <ConfirmationModal
        open={showDeleteModal}
        title={t('areYouSure')}
        message={t('branch.areYouSureDeleteBranch')}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
};

export default BranchForm;