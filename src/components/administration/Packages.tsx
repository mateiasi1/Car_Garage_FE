import { FC } from 'react';
import { useFetchCompaniesQuery } from '../../rtk/services/company-service';
import { useFetchPackagesQuery } from '../../rtk/services/package-service';
import { useTranslation } from 'react-i18next';

const PackagesPage: FC = () => {
    const { data: company } = useFetchCompaniesQuery();
    const { data: packages, error, isLoading } = useFetchPackagesQuery();
    const { t } = useTranslation();

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <p className="text-text font-body">{t('packages.loading')}</p>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <p className="text-error font-body">{t('packages.error')}</p>
        </div>
    );

    if (!packages || packages.length === 0) return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <p className="text-text font-body">{t('packages.noPackages')}</p>
        </div>
    );

    const activePackageId = company?.activePackage?.packageId;

    return (
        <div className="min-h-screen p-6">
            <div className="container mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-heading text-text">
                        {t('packages.availablePackages')}
                    </h1>
                    <p className="text-gray-600 mt-2 font-body">
                        {t('packages.choosePackageDescription')}
                    </p>
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg) => {
                        const isActive = pkg.id === activePackageId;

                        return (
                            <div
                                key={pkg.id}
                                className={`
                                    relative border rounded-lg shadow-md p-6 bg-card
                                    transition-all duration-200
                                    ${isActive
                                    ? 'border-primary border-2 ring-2 ring-primary ring-opacity-20'
                                    : 'border-gray-200 hover:border-primary hover:shadow-lg'
                                }
                                `}
                            >
                                {/* Active Badge */}
                                {isActive && (
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-primary text-primary-text text-xs font-semibold font-heading px-3 py-1 rounded-full">
                                            {t('packages.activeBadge')}
                                        </span>
                                    </div>
                                )}

                                {/* Package Name */}
                                <h3 className="text-2xl font-bold font-heading text-text mb-2">
                                    {pkg.name}
                                </h3>

                                {/* Price */}
                                <div className="mb-4">
                                    <span className="text-3xl font-bold font-heading text-primary">
                                        {pkg.price}
                                    </span>
                                    <span className="text-gray-600 font-body ml-1">RON</span>
                                </div>

                                {/* Description */}
                                {pkg.description && (
                                    <p className="text-gray-600 text-sm font-body mb-4">
                                        {pkg.description}
                                    </p>
                                )}

                                {/* Features */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2">
                                        <svg
                                            className="w-5 h-5 text-success"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-sm font-body text-text">
                                            {`${pkg.features.sms.limit} ${t('packages.smsPerMonth')}`}
                                        </span>
                                    </div>
                                </div>

                                {/* Current Package Badge */}
                                {isActive && (
                                    <div className="w-full py-2 px-4 bg-background text-text rounded text-center font-medium font-body">
                                        {t('packages.currentPackage')}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Purchase Note */}
                <div className="mt-8 p-4 bg-card border border-primary/20 rounded-lg shadow-sm">
                    <p className="text-sm text-text font-body">
                        <i className="fas fa-info-circle text-primary mr-2"></i>
                        {t('packages.purchaseNote')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PackagesPage;