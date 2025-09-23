import { FC } from 'react';
import { PersonItemProps } from '../shared/PersonItem';
import { PersonList } from '../shared/PersonList';
import { useFetchAllCustomersQuery } from '../../rtk/services/customer-service';

const CustomersList: FC = () => {
  const { data: customers, error, isLoading } = useFetchAllCustomersQuery();

  if (isLoading) return <p>Loading customers...</p>;
  if (error) return <p>Failed to load customers</p>;

  const items: PersonItemProps[] =
    customers?.map((customer) => ({
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: null,
      phoneNumber: customer.phoneNumber,
    })) ?? [];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] pb-4">
      <PersonList items={items} />
    </div>
  );
};

export default CustomersList;
