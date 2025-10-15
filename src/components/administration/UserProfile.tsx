import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PasswordForm } from './PasswordForm';
import { ProfileForm } from './ProfileForm';

const UserProfile: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-heading">{t('profile')}</h2>
      </div>
      <ProfileForm />
      <PasswordForm />
    </div>
  );
};

export default UserProfile;
