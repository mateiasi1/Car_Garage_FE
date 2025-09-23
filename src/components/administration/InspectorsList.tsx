import { FC } from 'react';
import { useFetchInspectorsQuery } from '../../rtk/services/inspector-service';
import { PersonItemProps } from '../shared/PersonItem';
import { PersonList } from '../shared/PersonList';

const InspectorsList: FC = () => {
  const { data: inspectors, error, isLoading } = useFetchInspectorsQuery();

  if (isLoading) return <p>Loading inspectors...</p>;
  if (error) return <p>Failed to load inspectors</p>;

  const items: PersonItemProps[] =
    inspectors?.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email ?? null,
      phoneNumber: null,
    })) ?? [];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] pb-4">
      <PersonList items={items} />
    </div>
  );
};

export default InspectorsList;
