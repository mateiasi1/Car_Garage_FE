import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../shared/PrimaryButton';
import PasswordInput from '../shared/PasswordInput';
import { showToast } from '../../utils/showToast';
import { useChangePasswordMutation } from '../../rtk/services/user-service';

type PasswordFields = 'currentPassword' | 'newPassword' | 'confirmNewPassword';

export const PasswordForm: FC = () => {
  const { t } = useTranslation();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: PasswordFields) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePasswordStrength = (password: string): boolean => {
    if (password.length < 8) {
      showToast(t('passwordTooShort'), 'error');
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      showToast(t('passwordNeedsUppercase'), 'error');
      return false;
    }

    if (!/[a-z]/.test(password)) {
      showToast(t('passwordNeedsLowercase'), 'error');
      return false;
    }

    if (!/\d/.test(password)) {
      showToast(t('passwordNeedsNumber'), 'error');
      return false;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      showToast(t('passwordNeedsSpecial'), 'error');
      return false;
    }

    return true;
  };

  const validateForm = (): boolean => {
    for (const [key, value] of Object.entries(form)) {
      if (!value.trim()) {
        showToast(t(`${key}Empty`), 'error');
        return false;
      }
    }

    if (form.newPassword !== form.confirmNewPassword) {
      showToast(t('passwordsDoNotMatch'), 'error');
      return false;
    }

    if (form.currentPassword === form.newPassword) {
      showToast(t('passwordMustBeDifferent'), 'error');
      return false;
    }

    return validatePasswordStrength(form.newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await changePassword(form).unwrap();
      showToast(t('passwordChangeSuccess'), 'success');
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      showToast(t('passwordChangeError'), 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-heading border-b pb-2">{t('changePassword')}</h2>
      <div className="grid grid-cols-1 gap-6">
        <PasswordInput
          name="currentPassword"
          label={t('currentPassword')}
          value={form.currentPassword}
          showPassword={showPasswords.currentPassword}
          onChange={handleChange}
          onToggleVisibility={() => togglePasswordVisibility('currentPassword')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PasswordInput
            name="newPassword"
            label={t('newPassword')}
            value={form.newPassword}
            showPassword={showPasswords.newPassword}
            onChange={handleChange}
            onToggleVisibility={() => togglePasswordVisibility('newPassword')}
          />
          <PasswordInput
            name="confirmNewPassword"
            label={t('confirmPassword')}
            value={form.confirmNewPassword}
            showPassword={showPasswords.confirmNewPassword}
            onChange={handleChange}
            onToggleVisibility={() => togglePasswordVisibility('confirmNewPassword')}
          />
        </div>
      </div>

      <PrimaryButton type="submit" text={t('changePassword')} disabled={isLoading} />
    </form>
  );
};
