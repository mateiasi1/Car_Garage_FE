import { FC } from 'react';
import { useFetchCompaniesQuery } from '../../rtk/services/company-service';
import { useTranslation } from 'react-i18next';

const CompanyDetails: FC = () => {
  const { data: company, error, isLoading } = useFetchCompaniesQuery();
  const { t } = useTranslation();

  if (isLoading) return <p>Loading company...</p>;
  if (error) return <p>Failed to load company</p>;
  if (!company) return <p>No company data available</p>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-heading">{t('companyData')}</h2>
      </div>
      <div className="flex flex-col border-l-4 border-primary">
        <div className="flex items-center gap-3 pl-4 py-2 hover:bg-gray-50 transition-colors duration-200">
          <span className="font-semibold w-48">{t('name')}:</span>
          <span>{company.name}</span>
        </div>

        <div className="flex items-center gap-3 pl-4 py-2 hover:bg-gray-50 transition-colors duration-200">
          <span className="font-semibold w-48">{t('country')}:</span>
          <span>{company.country}</span>
        </div>

        <div className="flex items-center gap-3 pl-4 py-2 hover:bg-gray-50 transition-colors duration-200">
          <span className="font-semibold w-48">{t('city')}:</span>
          <span>{company.city}</span>
        </div>

        {company.zipcode && (
          <div className="flex items-center gap-3 pl-4 py-2 hover:bg-gray-50 transition-colors duration-200">
            <span className="font-semibold w-48">{t('zipcode')}:</span>
            <span>{company.zipcode}</span>
          </div>
        )}

        <div className="flex items-center gap-3 pl-4 py-2 hover:bg-gray-50 transition-colors duration-200">
          <span className="font-semibold w-48">{t('street')}:</span>
          <span>{company.street}</span>
        </div>

        {company.streetNumber && (
          <div className="flex items-center gap-3 pl-4 py-2 hover:bg-gray-50 transition-colors duration-200">
            <span className="font-semibold w-48">{t('streetNumber')}:</span>
            <span>{company.streetNumber}</span>
          </div>
        )}

        {company.houseNumber && (
          <div className="flex items-center gap-3 pl-4 py-2 hover:bg-gray-50 transition-colors duration-200">
            <span className="font-semibold w-48">{t('houseNumber')}:</span>
            <span>{company.houseNumber}</span>
          </div>
        )}

        {company.phoneNumber && (
          <div className="flex items-center gap-3 pl-4 py-2 hover:bg-gray-50 transition-colors duration-200">
            <span className="font-semibold w-48">{t('phoneNumber')}:</span>
            <span>{company.phoneNumber}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default CompanyDetails;
