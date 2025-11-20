import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../utils/showToast.ts';
import { useUpdateBranchPackageMutation } from '../../rtk/services/branch-service.tsx';
import { useFetchPackagesQuery } from '../../rtk/services/package-service.tsx';
import Drawer from '../shared/Drawer.tsx';

interface PackageDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currentPackageId?: string;
    branchId: string;
}

const PackageSubscribeDrawer: FC<PackageDialogProps> = ({
    isOpen,
    onClose,
    currentPackageId,
    branchId,
}) => {
    const { data: packages } = useFetchPackagesQuery();
    const [updatePackage, { isLoading }] = useUpdateBranchPackageMutation();
    const { t } = useTranslation();

    const [selectedPackageId, setSelectedPackageId] = useState<string>('');
    const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
    const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

    // Set default selected package
    useEffect(() => {
        if (packages && packages.length > 0 && !selectedPackageId) {
            setSelectedPackageId(currentPackageId || packages[0].id);
        }
    }, [packages, currentPackageId, selectedPackageId]);

    // Calculate price when package or period changes
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

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={t('packages.selectPackageTitle')}>
            <div className="flex flex-col h-full">
                {/* Content */}
                <div className="flex-1 space-y-6 overflow-y-auto pr-1">
                    {/* Package Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('packages.choosePackage')}
                        </label>
                        <select
                            value={selectedPackageId}
                            onChange={(e) => setSelectedPackageId(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                            {packages?.map((pkg) => (
                                <option key={pkg.id} value={pkg.id}>
                                    {pkg.name} - {pkg.price} RON/lună
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Period Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('packages.selectPeriod')}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setPeriod('monthly')}
                                className={`p-3 border rounded-lg font-medium transition-all ${
                                    period === 'monthly'
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-gray-300 hover:border-primary'
                                }`}
                            >
                                {t('packages.monthly')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setPeriod('yearly')}
                                className={`p-3 border rounded-lg font-medium transition-all ${
                                    period === 'yearly'
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-gray-300 hover:border-primary'
                                }`}
                            >
                                {t('packages.yearly')}
                                <span className="block text-xs mt-1">
                  {t('packages.save')}{' '}
                                    {selectedPackage ? (selectedPackage.price * 2).toFixed(2) : 0} RON
                </span>
                            </button>
                        </div>
                    </div>

                    {/* Package Details */}
                    {selectedPackage && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">{selectedPackage.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                {selectedPackage.description}
                            </p>

                            <div className="flex items-center gap-2 text-sm">
                                <svg
                                    className="w-4 h-4 text-success"
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
                                <span>
                  {selectedPackage.features.sms.limit === -1
                      ? t('packages.unlimitedSMS')
                      : `${selectedPackage.features.sms.limit.toLocaleString(
                          'ro-RO',
                      )} ${t('packages.smsPerMonth')}`}
                </span>
                            </div>
                        </div>
                    )}

                    {/* Price Summary */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">{t('packages.period')}:</span>
                            <span className="font-medium">
                {period === 'yearly'
                    ? t('packages.12months')
                    : t('packages.1month')}
              </span>
                        </div>
                        <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">
                {t('packages.totalPrice')}:
              </span>
                            <span className="text-2xl font-bold text-primary">
                {calculatedPrice.toFixed(2)} RON
              </span>
                        </div>
                    </div>

                    {/* Action Info */}
                    {isSamePackage && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-800">
                                ℹ️ {t('packages.extendInfo')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="pt-4 mt-4 border-t flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={isLoading}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? t('packages.processing') : t('confirm')}
                    </button>
                </div>
            </div>
        </Drawer>
    );
};

export default PackageSubscribeDrawer;
