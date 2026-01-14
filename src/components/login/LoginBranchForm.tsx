import { FC, FormEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateBranchMutation as useOwnerCreateBranchMutation } from '../../rtk/services/branch-service';
import { useGetCountiesQuery, useGetCitiesByCountyQuery } from '../../rtk/services/location-service';
import { useForm } from '../../hooks/useForm';
import { CustomInput } from '../shared/CustomInput';
import { CustomSelect } from '../shared/CustomSelect';
import { Button } from '../shared/Button';
import { getErrorMessage } from '../../interfaces/error';
import { showToast } from '../../utils/showToast';
import { Branch } from '../../models/Branch';
import { PhoneNumberRoInput } from '../PhoneNumberRoInput';
import { AddressComponents, geocodeAddress, MapPicker } from '../shared/MapPicker';

interface LoginBranchFormProps {
  onBranchCreated: (branchId: string) => void;
}

type LoginBranchFormValues = {
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
};

const initialValues: LoginBranchFormValues = {
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
};

const LoginBranchForm: FC<LoginBranchFormProps> = ({ onBranchCreated }) => {
  const { t } = useTranslation();
  const [createOwnerBranch, { isLoading: isCreatingOwner }] = useOwnerCreateBranchMutation();
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingWarning, setGeocodingWarning] = useState<string | null>(null);
  const [pendingCityName, setPendingCityName] = useState<string | null>(null);

  const { values, errors, register, handleSubmit, isSubmitting, setFieldValue } = useForm<LoginBranchFormValues>({
    initialValues,
    fields: {
      name: {
        validate: (value) => {
          const v = String(value ?? '').trim();
          if (!v) return 'branch.branchNameEmpty';
          return null;
        },
      },
      phoneNumber: {
        validate: (value) => {
          const v = String(value ?? '').trim();
          if (!v) return 'branch.branchPhoneEmpty';
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
        phoneNumber: formValues.phoneNumber,
        country: formValues.country,
        cityId: formValues.cityId,
        street: formValues.street,
        streetNumber: formValues.streetNumber,
        houseNumber: formValues.houseNumber,
        zipcode: formValues.zipcode,
        latitude: formValues.latitude,
        longitude: formValues.longitude,
      };

      try {
        const created = (await createOwnerBranch(payload).unwrap()) as unknown as Branch;
        showToast(t('branch.branchCreateSuccess'), 'success');
        onBranchCreated(created.id);
      } catch (error) {
        showToast(getErrorMessage(error, t('branch.branchSaveError')), 'error');
      }
    },
  });

  const submitHandler = handleSubmit();

  const handleClick = () => {
    const fakeEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
    } as unknown as FormEvent<HTMLFormElement>;

    void submitHandler(fakeEvent);
  };

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

  useEffect(() => {
    if (pendingCityName && cities.length > 0 && !values.cityId) {
      const city = cities.find((c) => c.name.toLowerCase() === pendingCityName.toLowerCase());
      if (city) {
        setFieldValue('cityId', city.id);
        setPendingCityName(null);
      }
    }
  }, [cities, pendingCityName, values.cityId, setFieldValue]);

  // Reset city when county changes
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

    if (!values.countyId && address.county) {
      const county = counties.find((c) => c.name.toLowerCase() === address.county?.toLowerCase());
      if (county) {
        setFieldValue('countyId', county.id);
        if (address.city) {
          setPendingCityName(address.city);
        }
      }
    }

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

  const isSaving = isSubmitting || isCreatingOwner;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput
          label={t('branch.branchName')}
          {...register('name')}
          error={errors.name && t(errors.name)}
          wrapperClassName="mb-0 md:col-span-2"
        />

        <div className="mb-0 md:col-span-2">
          <PhoneNumberRoInput
            label={t('phoneNumber')}
            value={values.phoneNumber}
            onChange={(val) => setFieldValue('phoneNumber', val)}
            error={errors.phoneNumber && t(errors.phoneNumber)}
          />
        </div>

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
          onChange={handleMapChange}
          label={t('mapSelectLocation')}
        />
      </div>

      <Button type="button" fullWidth variant="primary" loading={isSaving} onClick={handleClick}>
        {t('confirm')}
      </Button>
    </div>
  );
};

export default LoginBranchForm;
