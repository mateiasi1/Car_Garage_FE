import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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

  const activePackage = company.activePackage;

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

          {/* City */}
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

      <div className="p-6 max-w-md">
        {activePackage ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <i className="fas fa-box text-primary text-xl"></i>
              <h3 className="text-lg font-bold font-heading text-primary">{t('packages.activePackage')}</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm font-body text-gray-600">{t('packages.packageName')}:</span>
                <span className="font-semibold font-heading text-text">{activePackage.package?.name || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm font-body text-gray-600">{t('packages.totalMessages')}:</span>
                <span className="font-semibold font-heading text-text">
                  {activePackage.usage?.sms?.limit === -1
                    ? t('packages.unlimited')
                    : activePackage.usage?.sms?.limit || 0}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm font-body text-gray-600">{t('packages.usedMessages')}:</span>
                <span className="font-semibold font-heading text-text">{activePackage.usage?.sms?.used || 0}</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-body text-gray-600">{t('packages.expiryDate')}:</span>
                <span className="font-semibold font-heading text-text">
                  {activePackage.expiringAt
                    ? new Date(activePackage.expiringAt).toLocaleDateString('ro-RO', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })
                    : t('packages.notSet')}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <i className="fas fa-box-open text-gray-400 text-xl"></i>
              <h3 className="text-lg font-bold font-heading text-gray-500">{t('packages.noActivePackage')}</h3>
            </div>
            <Link
              to="/packages"
              className="block w-full text-center px-4 py-2 bg-primary text-primary-text font-semibold font-heading rounded-lg hover:bg-primary-hover transition-colors"
            >
              <i className="fas fa-shopping-cart mr-2"></i>
              {t('packages.viewAllPackages')}
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;
