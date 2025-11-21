import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchCompanyQuery } from '../../rtk/services/company-service';

const CompanyDetails: FC = () => {
  const { data: company, error, isLoading } = useFetchCompanyQuery();
  const { t } = useTranslation();

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-text font-body">{t('company.loading')}</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-error font-body">{t('company.error')}</p>
      </div>
    );

  if (!company)
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-text font-body">{t('company.noData')}</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="p-6 max-w-md">
        <div className="flex items-center gap-2 mb-4">
          <i className="fas fa-clipboard-list text-primary text-xl"></i>
          <h3 className="text-lg font-bold font-heading text-primary">{t('companyData')}</h3>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-sm font-body text-gray-600 w-48 text-text">{t('name')}:</span>
            <span className="font-body text-text">{company.name}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-sm font-body text-gray-600 w-48 text-text">{t('country')}:</span>
            <span className="font-body text-text">{company.country}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-sm font-body text-gray-600 w-48 text-text">{t('city')}:</span>
            <span className="font-body text-text">{company.city}</span>
          </div>

          {company.zipcode && (
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm font-body text-gray-600 w-48 text-text">{t('zipcode')}:</span>
              <span className="font-body text-text">{company.zipcode}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-sm font-body text-gray-600 w-48 text-text">{t('street')}:</span>
            <span className="font-body text-text">{company.street}</span>
          </div>

          {company.streetNumber && (
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm font-body text-gray-600 w-48 text-text">{t('streetNumber')}:</span>
              <span className="font-body text-text">{company.streetNumber}</span>
            </div>
          )}

          {company.houseNumber && (
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm font-body text-gray-600 w-48 text-text">{t('houseNumber')}:</span>
              <span className="font-body text-text">{company.houseNumber}</span>
            </div>
          )}

          {company.phoneNumber && (
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm font-body text-gray-600 w-48 text-text">{t('phoneNumber')}:</span>
              <span className="font-body text-text">{company.phoneNumber}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
