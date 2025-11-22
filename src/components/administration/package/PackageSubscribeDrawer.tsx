import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Drawer from '../../shared/Drawer';
import { showToast } from '../../../utils/showToast';
import { useUpdateBranchPackageMutation } from '../../../rtk/services/branch-service';
import { useFetchPackagesQuery } from '../../../rtk/services/package-service';
import { Button } from '../../shared/Button';

interface PackageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPackageId?: string;
  branchId: string;
}

const PackageSubscribeDrawer: FC<PackageDialogProps> = ({ isOpen, onClose, currentPackageId, branchId }) => {
  const { data: packages } = useFetchPackagesQuery();
  const [updatePackage, { isLoading }] = useUpdateBranchPackageMutation();
  const { t } = useTranslation();

  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  // setează pachetul selectat inițial
  useEffect(() => {
    if (packages && packages.length > 0 && !selectedPackageId) {
      setSelectedPackageId(currentPackageId || packages[0].id);
    }
  }, [packages, currentPackageId, selectedPackageId]);

  // recalculează prețul când se schimbă pachetul sau perioada
  useEffect(() => {
    if (selectedPackageId && packages) {
      const selectedPkg = packages.find((p) => p.id === selectedPackageId);
      if (selectedPkg) {
        const multiplier = period === 'yearly' ? 10 : 1;
        setCalculatedPrice(selectedPkg.price * multiplier);
      }
    }
  }, [selectedPackageId, period, packages]);

  const handleSubmit = async () => {
    try {
      await updatePackage({
        branchId,
        data: {
          packageId: selectedPackageId,
          period,
        },
      }).unwrap();

      showToast(t('packages.updateSuccess'), 'success');
      onClose();
    } catch (error) {
      console.error('Failed to update package:', error);
      showToast(t('packages.updateError'), 'error');
    }
  };

  if (!isOpen) return null;

  const selectedPackage = packages?.find((p) => p.id === selectedPackageId);
  const isSamePackage = selectedPackageId === currentPackageId;

  const yearlySaving =
    selectedPackage && period === 'yearly'
      ? (selectedPackage.price * 12 - selectedPackage.price * 10).toFixed(2)
      : selectedPackage
        ? (selectedPackage.price * 2).toFixed(2)
        : '0';

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={t('packages.selectPackageTitle')}>
      <div className="flex flex-col h-full">
        {/* CONȚINUT */}
        <div className="flex-1 space-y-6 overflow-y-auto pr-1">
          {/* Selector pachet */}
          <div>
            <label className="block text-sm font-body font-semibold text-text mb-2">
              {t('packages.choosePackage')}
            </label>
            <select
              value={selectedPackageId}
              onChange={(e) => setSelectedPackageId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-card border border-text/10 text-text font-body focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {packages?.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} - {pkg.price} RON / {t('packages.1month')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="block text-sm font-body font-semibold text-text mb-2">{t('packages.selectPeriod')}</p>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={period === 'monthly' ? 'primary' : 'secondary'}
                size="md"
                className="h-24 rounded-2xl flex flex-col items-center justify-center text-center"
                onClick={() => setPeriod('monthly')}
              >
                <span className="text-base font-heading">{t('packages.monthly')}</span>
                <span className="text-xs font-body opacity-80 mt-1">{t('packages.1month')}</span>
              </Button>

              <Button
                type="button"
                variant={period === 'yearly' ? 'primary' : 'secondary'}
                size="md"
                className="h-24 rounded-2xl flex flex-col items-center justify-center text-center"
                onClick={() => setPeriod('yearly')}
              >
                <span className="text-base font-heading">{t('packages.yearly')}</span>
                <span className="text-xs font-body mt-1 opacity-80">
                  {t('packages.save')} {yearlySaving} RON
                </span>
              </Button>
            </div>
          </div>

          {selectedPackage && (
            <div className="bg-card border border-text/10 rounded-2xl p-4">
              <h3 className="font-semibold font-heading text-text mb-2">{selectedPackage.name}</h3>
              {selectedPackage.description && (
                <p className="text-sm font-body text-text/70 mb-3">{selectedPackage.description}</p>
              )}

              <div className="flex items-center gap-2 text-sm font-body text-text">
                <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  {selectedPackage.features.sms.limit === -1
                    ? t('packages.unlimitedSMS')
                    : `${selectedPackage.features.sms.limit.toLocaleString('ro-RO')} ${t('packages.smsPerMonth')}`}
                </span>
              </div>
            </div>
          )}

          <div className="border-t border-text/10 pt-4">
            <div className="flex justify-between items-center mb-2 text-sm font-body">
              <span className="text-text/70">{t('packages.period')}:</span>
              <span className="font-medium text-text">
                {period === 'yearly' ? t('packages.12months') : t('packages.1month')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base font-heading text-text">{t('packages.totalPrice')}:</span>
              <span className="text-2xl font-heading font-bold text-primary">{calculatedPrice.toFixed(2)} RON</span>
            </div>
          </div>

          {isSamePackage && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
              <p className="text-sm font-body text-blue-800">ℹ️ {t('packages.extendInfo')}</p>
            </div>
          )}
        </div>

        <div className="pt-4 mt-4 border-t border-text/10 flex gap-3">
          <Button type="button" variant="secondary" size="md" className="flex-1" onClick={onClose} disabled={isLoading}>
            {t('cancel')}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            className="flex-1"
            onClick={handleSubmit}
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? t('packages.processing') : t('confirm')}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default PackageSubscribeDrawer;
