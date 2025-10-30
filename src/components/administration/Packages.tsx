import { FC } from 'react';
import { useFetchCompaniesQuery } from '../../rtk/services/company-service';
import { useFetchPackagesQuery } from '../../rtk/services/package-service';
import { useTranslation } from 'react-i18next';

const PackagesPage: FC = () => {
    const { data: company } = useFetchCompaniesQuery();
    const { data: packages, error, isLoading } = useFetchPackagesQuery();
    const { t } = useTranslation();

    if (isLoading) return <p>Loading packages...</p>;
    if (error) return <p>Failed to load packages</p>;
    if (!packages || packages.length === 0) return <p>No packages available</p>;

    const activePackageId = company?.activePackage?.packageId;

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-heading">{t('packages.availablePackages')}</h1>
                <p className="text-gray-600 mt-2">{t('packages.choosePackageDescription')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => {
                    const isActive = pkg.id === activePackageId;

                    return (
                        <div
                            key={pkg.id}
                            className={`
                relative border rounded-lg shadow-sm p-6 bg-white
                ${isActive
                                ? 'border-primary border-2 ring-2 ring-primary ring-opacity-20'
                                : 'border-gray-200 hover:border-primary hover:shadow-md'
                            }
                transition-all duration-200
              `}
                        >
                            {/* Active Badge */}
                            {isActive && (
                                <div className="absolute top-4 right-4">
                  <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {t('packages.activeBadge')}
                  </span>
                                </div>
                            )}

                            {/* Package Name */}
                            <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>

                            {/* Price */}
                            <div className="mb-4">
                                <span className="text-3xl font-bold">{pkg.price}</span>
                                <span className="text-gray-600 ml-1">RON</span>
                            </div>

                            {/* Description */}
                            {pkg.description && (
                                <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                            )}

                            {/* Features */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-sm">
                                        {`${pkg.features.sms.limit} ${t('packages.smsPerMonth')}` }
                                    </span>
                                </div>
                            </div>

                            {isActive && (
                                <div className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded text-center font-medium">
                                    {t('packages.currentPackage')}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    * {t('packages.purchaseNote')}
                </p>
            </div>
        </div>
    );
};

export default PackagesPage;