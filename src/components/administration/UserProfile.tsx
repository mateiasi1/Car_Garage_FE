import { FC } from 'react';
import { ProfileForm } from './ProfileForm';
import { PasswordForm } from './PasswordForm';

const UserProfile: FC = () => {
  return (
    <div className="flex flex-col space-y-8">
      <ProfileForm />
      <PasswordForm />
    </div>
  );
};

export default UserProfile;
