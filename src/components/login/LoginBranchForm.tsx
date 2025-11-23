import { FC, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateBranchMutation as useOwnerCreateBranchMutation } from '../../rtk/services/branch-service';
import { useForm } from '../../hooks/useForm';
import { CustomInput } from '../shared/CustomInput';
import { Button } from '../shared/Button';
import { Error } from '../../interfaces/error';
import { showToast } from '../../utils/showToast';
import { Branch } from '../../models/Branch';
import { PhoneNumberRoInput } from '../PhoneNumberRoInput';

interface LoginBranchFormProps {
  onBranchCreated: (branchId: string) => void;
}

type LoginBranchFormValues = {
  name: string;
  phoneNumber: string;
  country: string;
  city: string;
  street: string;
  streetNumber?: string;
  houseNumber?: string;
  zipcode?: string;
};

const initialValues: LoginBranchFormValues = {
  name: '',
  phoneNumber: '',
  country: '',
  city: '',
  street: '',
  streetNumber: '',
  houseNumber: '',
  zipcode: '',
};

const LoginBranchForm: FC<LoginBranchFormProps> = ({ onBranchCreated }) => {
  const { t } = useTranslation();
  const [createOwnerBranch, { isLoading: isCreatingOwner }] = useOwnerCreateBranchMutation();

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
        phoneNumber: formValues.phoneNumber,
        country: formValues.country,
        city: formValues.city,
        street: formValues.street,
        streetNumber: formValues.streetNumber,
        houseNumber: formValues.houseNumber,
        zipcode: formValues.zipcode,
      };

      try {
        const created = (await createOwnerBranch(payload).unwrap()) as unknown as Branch;
        showToast(t('branch.branchCreateSuccess'), 'success');
        onBranchCreated(created.id);
      } catch (error) {
        showToast((error as Error).data?.message ?? t('branch.branchSaveError'), 'error');
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

      <Button type="button" fullWidth variant="primary" loading={isSaving} onClick={handleClick}>
        {t('confirm')}
      </Button>
    </div>
  );
};

export default LoginBranchForm;
