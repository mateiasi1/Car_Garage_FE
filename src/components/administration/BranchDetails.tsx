import { FC, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useFetchBranchQuery } from "../../rtk/services/branch-service";
import { useFetchCompanyBranchesQuery } from "../../rtk/services/company-service";
import { useSwitchBranchMutation } from "../../rtk/services/user-service";
import Drawer from '../shared/Drawer';
import { PrimaryButton } from '../shared/PrimaryButton';
import { showToast } from '../../utils/showToast';
import { Branch } from '../../models/Branch';
import {AuthContext} from "../../contexts/authContext";
import {Role} from "../../utils/enums/Role";

const BranchDetails: FC = () => {
    const { t } = useTranslation();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState<string>('');

    const { data: branch, error, isLoading } = useFetchBranchQuery();
    const { data: branches = [] } = useFetchCompanyBranchesQuery();
    const [switchBranch, { isLoading: isSwitching }] = useSwitchBranchMutation();

    const { user, login } = useContext(AuthContext);
    const isOwner = user?.roles?.some((r) => r.name === Role.owner);

    const handleSwitchBranch = async () => {
        if (!selectedBranchId) {
            showToast(t('branch.selectBranch'), 'error');
            return;
        }

        try {
            const result = await switchBranch({ branchId: selectedBranchId }).unwrap();

            if (result.accessToken) {
                login({ accessToken: result.accessToken });

                showToast(t('branch.branchSwitchedSuccessfully'), 'success');
                setDrawerOpen(false);

                window.location.reload();
            }
        } catch (error) {
            showToast(t('branch.errorSwitchingBranch'), 'error');
        }
    };

    if (isLoading)
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-text font-body">{t('branch.loading')}</p>
            </div>
        );

    if (error)
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-error font-body">{t('branch.error')}</p>
            </div>
        );

    if (!branch)
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-text font-body">{t('branch.noData')}</p>
            </div>
        );

    const activePackage = branch.activePackage;

    return (
        <div className="space-y-6">
            <div className="p-6 max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <i className="fas fa-clipboard-list text-primary text-xl"></i>
                        <h3 className="text-lg font-bold font-heading text-primary">{t('branch.data')}</h3>
                    </div>
                    {branches.length > 1 && (
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
                        >
                            <i className="fas fa-exchange-alt mr-2"></i>
                            {t('branch.switchBranch')}
                        </button>
                    )}
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-sm font-body text-gray-600 w-48 text-text">{t('branch.name')}:</span>
                        <span className="font-body text-text">{branch.name}</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-sm font-body text-gray-600 w-48 text-text">{t('branch.country')}:</span>
                        <span className="font-body text-text">{branch.country}</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-sm font-body text-gray-600 w-48 text-text">{t('branch.city')}:</span>
                        <span className="font-body text-text">{branch.city}</span>
                    </div>

                    {branch.zipcode && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                            <span className="text-sm font-body text-gray-600 w-48 text-text">{t('branch.zipcode')}:</span>
                            <span className="font-body text-text">{branch.zipcode}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-sm font-body text-gray-600 w-48 text-text">{t('branch.street')}:</span>
                        <span className="font-body text-text">{branch.street}</span>
                    </div>

                    {branch.streetNumber && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                            <span className="text-sm font-body text-gray-600 w-48 text-text">{t('branch.streetNumber')}:</span>
                            <span className="font-body text-text">{branch.streetNumber}</span>
                        </div>
                    )}

                    {branch.houseNumber && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                            <span className="text-sm font-body text-gray-600 w-48 text-text">{t('branch.houseNumber')}:</span>
                            <span className="font-body text-text">{branch.houseNumber}</span>
                        </div>
                    )}

                    {branch.phoneNumber && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                            <span className="text-sm font-body text-gray-600 w-48 text-text">{t('branch.phoneNumber')}:</span>
                            <span className="font-body text-text">{branch.phoneNumber}</span>
                        </div>
                    )}
                </div>
            </div>

            {isOwner && (
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
            )}

            <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={t('branch.switchBranch')}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-2">{t('branch.selectBranch')}</label>
                        <select
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-primary"
                        >
                            <option value="">{t('branch.selectBranch')}</option>
                            {branches.map((b: Branch) => (
                                <option key={b.id} value={b.id}>
                                    {b.name} - {b.city}
                                </option>
                            ))}
                        </select>
                    </div>

                    <PrimaryButton
                        text={t('branch.confirm')}
                        onClick={handleSwitchBranch}
                        disabled={!selectedBranchId || isSwitching}
                        className="w-full"
                    />
                </div>
            </Drawer>
        </div>
    );
};

export default BranchDetails;