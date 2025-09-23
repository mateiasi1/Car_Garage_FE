import React from 'react';
import { PersonItem, PersonItemProps } from './PersonItem';

interface PersonListProps {
  items: PersonItemProps[];
}

export const PersonList: React.FC<PersonListProps> = ({ items }) => {
  return (
    <div className="flex flex-col h-full pb-4">
      <div className="flex-1 min-h-0 pr-4 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {items.map((item, idx) => (
          <PersonItem key={item.id} {...item} isLast={idx === items.length - 1} />
        ))}
      </div>
    </div>
  );
};
