import { FC, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/authContext';
import { useUpdateUserProfileMutation } from '../../rtk/services/user-service';
import { showToast } from '../../utils/showToast';
import { PrimaryButton } from '../shared/PrimaryButton';

export const ProfileForm: FC = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

  const [form, setForm] = useState({
    username: user?.username || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });

  const inputBaseClass =
    'w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-primary';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    for (const [key, value] of Object.entries(form)) {
      if (!value.trim()) {
        showToast(t(`${key}Empty`), 'error');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateProfile(form).unwrap();
      showToast(t('profileUpdateSuccess'), 'success');
    } catch (error) {
      showToast(t('profileUpdateError'), 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-heading border-b pb-2">{t('profileInformation')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-full">
          <label className="block font-semibold mb-1">{t('username')}</label>
          <input type="text" name="username" value={form.username} disabled className={inputBaseClass} />
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

        <div>
          <label className="block font-semibold mb-1">{t('lastName')}</label>
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className={inputBaseClass} />
        </div>
      </div>

      <PrimaryButton type="submit" text={t('saveProfile')} disabled={isLoading} />
    </form>
  );
};
