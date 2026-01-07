import { FC, useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '../../interfaces/error';
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
import { MapPicker, geocodeAddress, AddressComponents } from '../shared/MapPicker';

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
  latitude?: number;
  longitude?: number;
  isDemo: boolean;
};

const CompanyForm: FC<CompanyFormProps> = ({ selectedCompany, onCloseDrawer }) => {
  const { t } = useTranslation();

  const [createCompany, { isLoading: isCreating }] = useCreateAdminCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateAdminCompanyMutation();
  const [deleteCompany] = useDeleteAdminCompanyMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingWarning, setGeocodingWarning] = useState<string | null>(null);
  const [pendingCityName, setPendingCityName] = useState<string | null>(null);

  const isEdit = Boolean(selectedCompany?.id);

  // Extract countyId and cityId from selectedCompany.cityRef
  const initialCountyId = selectedCompany?.cityRef?.county?.id ?? '';
  const initialCityId = selectedCompany?.cityId ?? '';

  const { values, errors, register, handleSubmit, isSubmitting, setFieldValue, isDirty } = useForm<CompanyFormValues>({
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
      latitude: selectedCompany?.latitude,
      longitude: selectedCompany?.longitude,
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
        latitude: formValues.latitude,
        longitude: formValues.longitude,
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
        showToast(getErrorMessage(error, t('companySaveError')), 'error');
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

  // Reset city when county changes
  const handleCountyChange = (countyId: string) => {
    setFieldValue('countyId', countyId);
    setFieldValue('cityId', '');
  };

  // Forward geocoding: Find location on map from address
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

        // Show appropriate message based on accuracy
        if (result.accuracy === 'exact') {
          showToast(t('geocodingSuccessExact'), 'success');
          setGeocodingWarning(null);
        } else if (result.accuracy === 'street') {
          showToast(t('geocodingSuccessStreetAdjust'), 'success');
          setGeocodingWarning(t('geocodingWarningStreet'));
        } else if (result.accuracy === 'city') {
          showToast(t('geocodingWarningCity'), 'info');
          setGeocodingWarning(t('geocodingWarningCityLong'));
        }
      } else {
        showToast(t('geocodingNotFound'), 'info');
        setGeocodingWarning(t('geocodingWarningNotFound'));
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      showToast(t('geocodingError'), 'error');
    } finally {
      setIsGeocoding(false);
    }
  };

  // Reverse geocoding: Fill address from map pin
  const handleAddressChange = (addressComponents: AddressComponents) => {
    // Only fill empty fields
    if (!values.countyId && addressComponents.county) {
      const county = counties.find((c) => c.name.toLowerCase() === addressComponents.county?.toLowerCase());
      if (county) {
        setFieldValue('countyId', county.id);
        // Save city name to be set after cities load
        if (addressComponents.city) {
          setPendingCityName(addressComponents.city);
        }
      }
    }

    // Keep the city lookup for when county is already set
    if (values.countyId && !values.cityId && addressComponents.city) {
      const city = cities.find((c) => c.name.toLowerCase() === addressComponents.city?.toLowerCase());
      if (city) {
        setFieldValue('cityId', city.id);
      }
    }

    if (!values.street && addressComponents.street) {
      setFieldValue('street', addressComponents.street);
    }

    if (!values.streetNumber && addressComponents.streetNumber) {
      setFieldValue('streetNumber', addressComponents.streetNumber);
    }
  };

  const handleDelete = async () => {
    if (!values.id) return;

    try {
      await deleteCompany(values.id).unwrap();
      showToast(t('companyDeleteSuccess'), 'success');
      setShowDeleteModal(false);
      onCloseDrawer();
    } catch (error) {
      showToast(getErrorMessage(error, t('companyDeleteError')), 'error');
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            label={`${t('companyName')}`}
            {...register('name')}
            error={errors.name && t(errors.name)}
            wrapperClassName="mb-0 md:col-span-2"
            isRequired
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
            isRequired
          />
          {isEdit && (
            <p className="text-xs font-body text-text/60 md:col-span-2">{t('companyShortNameCannotBeChanged')}</p>
          )}

          <CustomInput
            label={`${t('email')}`}
            {...register('email')}
            error={errors.email && t(errors.email)}
            wrapperClassName="mb-0"
            isRequired
          />

          <div className="mb-0">
            <PhoneNumberRoInput
              label={`${t('phoneNumber')}`}
              value={values.phoneNumber}
              onChange={(val) => setFieldValue('phoneNumber', val)}
              error={errors.phoneNumber && t(errors.phoneNumber)}
              isRequired
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

        {/* Map Section */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <h3 className="text-sm font-semibold font-body text-text">{t('locationCoordinates')}</h3>
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
              <span className="text-yellow-600 text-sm font-body">{geocodingWarning}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomInput
              label={t('latitude')}
              value={values.latitude?.toString() ?? ''}
              disabled
              wrapperClassName="mb-0"
              placeholder="--"
            />
            <CustomInput
              label={t('longitude')}
              value={values.longitude?.toString() ?? ''}
              disabled
              wrapperClassName="mb-0"
              placeholder="--"
            />
          </div>

          <MapPicker
            latitude={values.latitude}
            longitude={values.longitude}
            onChange={(lat, lng, address) => {
              setFieldValue('latitude', lat);
              setFieldValue('longitude', lng);
              if (address) {
                handleAddressChange(address);
              }
            }}
            label={t('mapSelectLocation')}
          />
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
            disabled={!isDirty}
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
