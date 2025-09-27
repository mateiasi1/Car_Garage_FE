import { FC } from 'react';

interface UserAvatarProps {
  firstName?: string;
}

export const UserAvatar: FC<UserAvatarProps> = ({ firstName }) => {
  return (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
      {firstName ? firstName[0] : ''}
    </div>
  );
};
