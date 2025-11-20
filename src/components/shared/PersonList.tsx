import { PersonItem, PersonItemBase } from './PersonItem';

export interface PersonListProps<T extends PersonItemBase> {
  items: T[];
  onItemClick?: (item: T) => void;
}

export const PersonList = <T extends PersonItemBase>({ items, onItemClick }: PersonListProps<T>) => {
  return (
    <div className="flex-1 min-h-0 pr-4 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {items.map((item, idx) => (
        <PersonItem key={item.id ?? idx} item={item} isLast={idx === items.length - 1} onClick={onItemClick} />
      ))}
    </div>
  );
};
