import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileForm } from './ProfileForm';
import { PasswordForm } from './PasswordForm';
import { Text } from '../../shared/Text';

const UserProfile: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <Text variant="h3" className="text-text">
        {t('profile')}
      </Text>
      <ProfileForm />
      <PasswordForm />
    </div>
  );
};

export default UserProfile;
