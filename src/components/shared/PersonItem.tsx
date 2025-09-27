import React from 'react';
import { UserAvatar } from './UserAvatar';

export interface PersonItemProps {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phoneNumber?: string | null;
  onClick?: () => void;
  isLast?: boolean;
}

export const PersonItem: React.FC<PersonItemProps> = ({ firstName, lastName, email, phoneNumber, onClick, isLast }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 border-l-4 border-primary p-4 cursor-pointer hover:bg-gray-100/40 transition-colors duration-200
                  ${!isLast ? 'shadow-[0_1px_0_rgba(0,0,0,0.05)]' : ''}`}
    >
      <UserAvatar firstName={firstName} />
      <div className="flex flex-col">
        <span className="font-heading text-text text-base">
          {firstName} {lastName}
        </span>
        {(email || phoneNumber) && (
          <span className="text-sm text-gray-500 flex items-center gap-2">
            {email && <>{`Email: ${email}`}</>}
            {email && phoneNumber && <span className="inline-block w-1 h-1 rounded-full bg-gray-400" />}
            {phoneNumber && <>{`Tel: ${phoneNumber}`}</>}
          </span>
        )}
      </div>
    </div>
  );
};
