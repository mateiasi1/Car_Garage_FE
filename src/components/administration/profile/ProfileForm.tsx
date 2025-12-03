import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateUserProfileMutation } from '../../../rtk/services/user-service';
import { useAuth } from '../../../hooks/useAuth';
import { useForm } from '../../../hooks/useForm';
import { FormSection } from '../../shared/FormGrid';
import { CustomInput } from '../../shared/CustomInput';
import { Button } from '../../shared/Button';
import { useDemo } from '../../../hooks/useDemo';

type ProfileFormValues = {
  username: string;
  firstName: string;
  lastName: string;
};

export const ProfileForm: FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [updateProfile] = useUpdateUserProfileMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { isDemo } = useDemo();

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setSubmitError(null);
      await updateProfile(values).unwrap();
    } catch {
      setSubmitError(t('profileUpdateError'));
    }
  };

  const { register, errors, handleSubmit, isSubmitting, canSubmit } = useForm<ProfileFormValues>({
    initialValues: {
      username: user?.username || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
    fields: {
      username: { required: true },
      firstName: { required: true },
      lastName: { required: true },
    },
    onSubmit,
  });

  return (
    <FormSection title={t('profileInformation')}>
      {isDemo && <p className="text-amber-600 text-sm font-body mb-4">{t('demo.profileEditDisabled')}</p>}
      <form onSubmit={handleSubmit()} className="space-y-6">
        <CustomInput
          label={t('username')}
          disabled
          wrapperClassName="mb-2"
          error={errors.username ? t(errors.username) : undefined}
          {...register('username')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            label={t('firstName')}
            wrapperClassName="mb-0"
            error={errors.firstName ? t(errors.firstName) : undefined}
            disabled={isDemo}
            {...register('firstName')}
          />
          <CustomInput
            label={t('lastName')}
            wrapperClassName="mb-0"
            error={errors.lastName ? t(errors.lastName) : undefined}
            disabled={isDemo}
            {...register('lastName')}
          />
        </div>

        {submitError && <p className="text-error text-sm font-body">{submitError}</p>}

        <div className="pt-2">
          <Button type="submit" variant="primary" size="md" disabled={!canSubmit || isDemo} loading={isSubmitting}>
            {t('saveProfile')}
          </Button>
        </div>
      </form>
    </FormSection>
  );
};
