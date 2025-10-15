import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchAdminCompaniesQuery } from '../../rtk/services/admin-service';
import { UserAvatar } from '../shared/UserAvatar';

const AdminCompanies: FC = () => {
  const { data: companies, error, isLoading } = useFetchAdminCompaniesQuery();
  const { t } = useTranslation();

  if (isLoading) return <p>Loading companies...</p>;
  if (error) {
    console.log(error);
    return <p>Failed to load companies</p>;
  }

  const onClick = () => {
    console.log('clicked a company');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] pb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-heading">{t('companies')}</h2>
      </div>
      <div className="flex-1 min-h-0 pr-4 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {companies?.map((company, index) => (
          <div
            onClick={onClick}
            key={company.id}
            className={`flex items-center gap-4 border-l-4 border-primary p-4 cursor-pointer hover:bg-gray-100/40 transition-colors duration-200
                  ${!(index === companies.length - 1) ? 'shadow-[0_1px_0_rgba(0,0,0,0.05)]' : ''}`}
          >
            <UserAvatar firstName={company.name} />
            <div className="flex flex-col">
              <span className="font-heading text-text text-base">{company.name}</span>
              <span className="text-sm text-gray-500 flex items-center gap-2">
                {company.country}
                <span className="inline-block w-1 h-1 rounded-full bg-gray-400" />
                {company.city}
                <span className="inline-block w-1 h-1 rounded-full bg-gray-400" />
                {company.street} {company.streetNumber && <>{company.streetNumber}</>}
                <span className="inline-block w-1 h-1 rounded-full bg-gray-400" />
                {company.phoneNumber && <>{`Tel: ${company.phoneNumber}`}</>}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCompanies;
