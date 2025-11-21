import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChangePasswordMutation } from '../../../rtk/services/user-service';
import { useForm } from '../../../hooks/useForm';
import { FormSection } from '../../shared/FormGrid';
import { CustomInput } from '../../shared/CustomInput';
import { Button } from '../../shared/Button';

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export const PasswordForm: FC = () => {
  const { t } = useTranslation();
  const [changePassword] = useChangePasswordMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (values: PasswordFormValues) => {
    try {
      setSubmitError(null);
      await changePassword(values).unwrap();
    } catch {
      setSubmitError(t('passwordChangeError'));
    }
  };

  const { register, errors, handleSubmit, isSubmitting, canSubmit } = useForm<PasswordFormValues>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    fields: {
      currentPassword: {
        required: true,
      },
      newPassword: {
        required: true,
        validate: (value, values) => {
          const password = String(value ?? '');

          if (password.length < 8) return 'passwordTooShort';
          if (!/[A-Z]/.test(password)) return 'passwordNeedsUppercase';
          if (!/[a-z]/.test(password)) return 'passwordNeedsLowercase';
          if (!/\d/.test(password)) return 'passwordNeedsNumber';
          if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'passwordNeedsSpecial';
          if (password === String(values.currentPassword ?? '')) return 'passwordMustBeDifferent';

          return null;
        },
      },
      confirmNewPassword: {
        required: true,
        validate: (value, values) => {
          if (String(value ?? '') !== String(values.newPassword ?? '')) {
            return 'passwordsDoNotMatch';
          }
          return null;
        },
      },
    },
    onSubmit,
  });

  return (
    <FormSection title={t('changePassword')}>
      <form onSubmit={handleSubmit()} className="space-y-6">
        <CustomInput
          type="password"
          label={t('currentPassword')}
          error={errors.currentPassword ? t(errors.currentPassword) : undefined}
          {...register('currentPassword')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            type="password"
            label={t('newPassword')}
            wrapperClassName="mb-0"
            error={errors.newPassword ? t(errors.newPassword) : undefined}
            {...register('newPassword')}
          />
          <CustomInput
            type="password"
            label={t('confirmPassword')}
            wrapperClassName="mb-0"
            error={errors.confirmNewPassword ? t(errors.confirmNewPassword) : undefined}
            {...register('confirmNewPassword')}
          />
        </div>

        {submitError && <p className="text-error text-sm font-body">{submitError}</p>}

        <div className="pt-2">
          <Button type="submit" variant="primary" size="md" disabled={!canSubmit} loading={isSubmitting}>
            {t('changePassword')}
          </Button>
        </div>
      </form>
    </FormSection>
  );
};
