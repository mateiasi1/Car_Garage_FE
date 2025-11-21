import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileForm } from './ProfileForm';
import { PasswordForm } from './PasswordForm';
import { CustomText } from '../../shared/CustomText';

const UserProfile: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <CustomText variant="h3" className="text-text">
        {t('profile')}
      </CustomText>
      <ProfileForm />
      <PasswordForm />
    </div>
  );
};

export default UserProfile;
