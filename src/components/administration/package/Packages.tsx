import { FC, useMemo } from 'react';
import { useFetchPackagesQuery } from '../../../rtk/services/package-service';
import { useFetchBranchDiscountsQuery } from '../../../rtk/services/discount-service';
import { useTranslation } from 'react-i18next';
import { useFetchBranchQuery } from '../../../rtk/services/branch-service';
import { Check, Store, Percent, Clock } from 'lucide-react';
import { PageHeader } from '../../shared/PageHeader';

const PackagesPage: FC = () => {
  const { data: branch } = useFetchBranchQuery();
  const { data: packages, error, isLoading } = useFetchPackagesQuery();
  const { t } = useTranslation();

  // Get package IDs for discount query
  const packageIds = useMemo(() => packages?.map((pkg) => pkg.id) || [], [packages]);

  // Fetch discounts for all packages (Owner has branchId in token, so no need to pass it)
  const { data: discounts = {} } = useFetchBranchDiscountsQuery(
    { packageIds },
    { skip: packageIds.length === 0 }
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text font-body">{t('packages.loading')}</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-error font-body">{t('packages.error')}</p>
      </div>
    );

  if (!packages || packages.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text font-body">{t('packages.noPackages')}</p>
      </div>
    );

  const activePackageId = branch?.activePackage?.package?.id;

  return (
    <div className="pb-4 min-h-screen flex flex-col">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <PageHeader title={t('packages.availablePackages')} icon={Store} className="mb-4" />

        {/* Description sub-title */}
        <p className="px-6 mb-4 text-muted font-body max-w-lg">{t('packages.choosePackageDescription')}</p>

        {/* Packages grid */}
        <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const isActive = pkg.id === activePackageId;
            const discountInfo = discounts[pkg.id];
            const hasDiscount = discountInfo && discountInfo.percentage > 0;
            const discountedPrice = hasDiscount ? pkg.price * (1 - discountInfo.percentage / 100) : pkg.price;

            return (
              <div
                key={pkg.id}
                className={`
                  relative rounded-xl p-6 flex flex-col gap-5
                  transition-all duration-200
                  bg-surface border
                  ${isActive ? 'border-primary bg-primary-light' : 'border-border hover:border-primary/50'}
                `}
              >
                {/* Discount badge */}
                {hasDiscount && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-success text-white text-xs font-heading px-3 py-1 rounded-full flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      -{discountInfo.percentage}%
                    </span>
                  </div>
                )}

                {isActive && (
                  <div className={`absolute top-4 ${hasDiscount ? 'right-4' : 'right-4'}`}>
                    <span className="bg-primary text-primary-text text-xs font-heading px-3 py-1 rounded-full">
                      {t('packages.activeBadge')}
                    </span>
                  </div>
                )}

                {/* Name */}
                <h3 className={`text-xl font-heading text-text ${hasDiscount ? 'mt-6' : ''}`}>{pkg.name}</h3>

                {/* Price */}
                <div>
                  {hasDiscount ? (
                    <>
                      <span className="text-lg text-muted line-through font-heading mr-2">{pkg.price}</span>
                      <span className="text-3xl font-bold font-heading text-success">{discountedPrice.toFixed(0)}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold font-heading text-primary">{pkg.price}</span>
                  )}
                  <span className="ml-1 text-muted font-body">RON</span>
                </div>

                {/* Discount expiry */}
                {hasDiscount && discountInfo.expiresAt && (
                  <div className="flex items-center gap-2 text-xs text-muted font-body">
                    <Clock className="w-3 h-3" />
                    <span>
                      {t('packages.discountExpires')} {new Date(discountInfo.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Description */}
                {pkg.description && <p className="text-sm text-muted font-body leading-relaxed">{pkg.description}</p>}

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-body text-text">
                      {`${pkg.features.sms.limit} ${t('packages.smsPerMonth')}`}
                    </span>
                  </div>
                </div>

                {/* Active badge bottom */}
                {isActive && (
                  <div className="mt-4 py-2 px-4 bg-primary-light text-text rounded-lg text-center font-body text-sm">
                    {t('packages.currentPackage')}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info note */}
        <div className="mx-6 mt-6 p-4 rounded-xl bg-primary-light border border-border flex items-center gap-3">
          <Store className="w-6 h-6 text-primary" />
          <p className="text-sm text-text font-body">{t('packages.purchaseNote')}</p>
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;
