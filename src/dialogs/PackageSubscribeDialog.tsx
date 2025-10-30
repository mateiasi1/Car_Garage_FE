import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import {useFetchPackagesQuery} from "../rtk/services/package-service.ts";
import {useUpdatePackageMutation} from "../rtk/services/company-service.tsx";
import { showToast } from "../utils/showToast.ts";

interface PackageDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currentPackageId?: string;
    companyId: string;
}

const PackageSubscribeDialog: FC<PackageDialogProps> = ({ isOpen, onClose, currentPackageId, companyId }) => {
    const { data: packages } = useFetchPackagesQuery();
    const [updatePackage, { isLoading }] = useUpdatePackageMutation();
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
            const selectedPkg = packages.find(p => p.id === selectedPackageId);
            if (selectedPkg) {
                const multiplier = period === 'yearly' ? 10 : 1;
                setCalculatedPrice(selectedPkg.price * multiplier);
            }
        }
    }, [selectedPackageId, period, packages]);

    const handleSubmit = async () => {
        try {
            await updatePackage({
                companyId,
                packageId: selectedPackageId,
                period,
            }).unwrap();

            showToast(t('packages.updateSuccess'), 'success');
            onClose();
        } catch (error) {
            console.error('Failed to update package:', error);
            showToast(t('packages.updateError'), 'error');
        }
    };

    if (!isOpen) return null;

    const selectedPackage = packages?.find(p => p.id === selectedPackageId);
    const isSamePackage = selectedPackageId === currentPackageId;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">{/* Changed from max-w-md to max-w-2xl */}
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faStore} className="text-primary text-2xl" />
                        <h2 className="text-2xl font-bold">{t('packages.selectPackageTitle')}</h2>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
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
                                onClick={() => setPeriod('yearly')}
                                className={`p-3 border rounded-lg font-medium transition-all ${
                                    period === 'yearly'
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-gray-300 hover:border-primary'
                                }`}
                            >
                                {t('packages.yearly')}
                                <span className="block text-xs mt-1">
                  {t('packages.save')} {selectedPackage ? (selectedPackage.price * 2).toFixed(2) : 0} RON
                </span>
                            </button>
                        </div>
                    </div>

                    {/* Package Details */}
                    {selectedPackage && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">{selectedPackage.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{selectedPackage.description}</p>

                            <div className="flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>
                  {selectedPackage.features.sms.limit === -1
                      ? t('packages.unlimitedSMS')
                      : `${selectedPackage.features.sms.limit.toLocaleString('ro-RO')} ${t('packages.smsPerMonth')}`
                  }
                </span>
                            </div>
                        </div>
                    )}

                    {/* Price Summary */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">{t('packages.period')}:</span>
                            <span className="font-medium">
                {period === 'yearly' ? t('packages.12months') : t('packages.1month')}
              </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">{t('packages.totalPrice')}:</span>
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
                <div className="p-6 border-t flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={isLoading}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? t('packages.processing') : t('confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PackageSubscribeDialog;