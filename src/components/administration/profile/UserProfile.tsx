import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileForm } from './ProfileForm';
import { PasswordForm } from './PasswordForm';
import { CustomText } from '../../shared/CustomText';
import { IdCard } from 'lucide-react';

const UserProfile: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4 sm:p-5 lg:p-6 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <IdCard className="w-6 h-6 text-primary" />
        </div>
        <CustomText variant="h3" color="primary">
          {t('profile')}
        </CustomText>
      </div>
      <ProfileForm />
      <PasswordForm />
    </div>
  );
};

export default UserProfile;
