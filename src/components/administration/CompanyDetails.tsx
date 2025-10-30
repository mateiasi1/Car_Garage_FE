import { FC } from 'react';
import { useFetchCompaniesQuery } from '../../rtk/services/company-service';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CompanyDetails: FC = () => {
    const { data: company, error, isLoading } = useFetchCompaniesQuery();
    const { t } = useTranslation();

    if (isLoading) return <p>Loading company...</p>;
    if (error) return <p>Failed to load company</p>;
    if (!company) return <p>No company data available</p>;

    // ActivePackage is now a single object, not an array
    const activePackage = company.activePackage;

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

            {/* Active Package Card */}
            <div className="mt-6">
                {activePackage ? (
                    <div className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white max-w-md">
                        <h3 className="text-base font-semibold mb-3 text-primary">
                            {t('packages.activePackage')}
                        </h3>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">{t('packages.packageName')}:</span>
                                <span className="font-semibold">{activePackage.package?.name || 'N/A'}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">{t('packages.totalMessages')}:</span>
                                <span className="font-semibold">
                  {activePackage.usage?.sms?.limit === -1
                      ? t('packages.unlimited')
                      : activePackage.usage?.sms?.limit || 0}
                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">{t('packages.usedMessages')}:</span>
                                <span className="font-semibold">{activePackage.usage?.sms?.used || 0}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">{t('packages.expiryDate')}:</span>
                                <span className="font-semibold">
                  {activePackage.expiringAt
                      ? new Date(activePackage.expiringAt).toLocaleDateString('ro-RO', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                      })
                      : t('packages.notSet')}
                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white max-w-md">
                        <h3 className="text-base font-semibold mb-3 text-gray-500">
                            {t('packages.noActivePackage')}
                        </h3>
                        <Link
                            to="/packages"
                            className="block w-full text-center px-3 py-2 text-sm bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                        >
                            {t('packages.viewAllPackages')}
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default CompanyDetails;