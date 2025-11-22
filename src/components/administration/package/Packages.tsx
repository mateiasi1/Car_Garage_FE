import { FC } from 'react';
import { useFetchPackagesQuery } from '../../../rtk/services/package-service';
import { useTranslation } from 'react-i18next';
import { useFetchBranchQuery } from '../../../rtk/services/branch-service';
import { Check, Store } from 'lucide-react';
import { PageHeader } from '../../shared/PageHeader';

const PackagesPage: FC = () => {
  const { data: branch } = useFetchBranchQuery();
  const { data: packages, error, isLoading } = useFetchPackagesQuery();
  const { t } = useTranslation();

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
      <div className="w-full max-w-6xl mx-auto space-y-10">
        <PageHeader title={t('packages.availablePackages')} icon={Store} />
        <p className="p-6 text-text/60 font-body max-w-lg">{t('packages.choosePackageDescription')}</p>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const isActive = pkg.id === activePackageId;

            return (
              <div
                key={pkg.id}
                className={`
                  relative rounded-3xl p-6 flex flex-col gap-5
                  transition-all duration-200
                  bg-card border
                  ${isActive ? 'border-primary bg-primary/5' : 'border-text/10 hover:border-primary/50 hover:shadow-sm'}
                `}
              >
                {isActive && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-primary text-primary-text text-xs font-heading px-3 py-1 rounded-full shadow-sm">
                      {t('packages.activeBadge')}
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-heading text-text">{pkg.name}</h3>

                <div>
                  <span className="text-3xl font-bold font-heading text-primary">{pkg.price}</span>
                  <span className="ml-1 text-text/60 font-body">RON</span>
                </div>

                {pkg.description && <p className="text-sm text-text/70 font-body leading-relaxed">{pkg.description}</p>}

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

                {isActive && (
                  <div className="mt-4 py-2 px-4 bg-background/60 text-text rounded-xl text-center font-body text-sm">
                    {t('packages.currentPackage')}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="m-6 p-6 rounded-2xl bg-background/60 border border-text/10 flex items-center gap-3">
          <Store className="w-6 h-6 text-primary" />
          <p className="text-sm text-text font-body">{t('packages.purchaseNote')}</p>
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;
