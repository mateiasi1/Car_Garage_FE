import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    useCreateBranchMutation,
    useUpdateBranchMutation,
    useDeleteBranchMutation,
    useUpdateBranchPackageMutation,
} from '../../rtk/services/branch-service';
import { useFetchPackagesQuery } from '../../rtk/services/package-service';
import { Branch } from '../../models/Branch';
import { UpdatePackageRequest } from '../../models/Branch';
import { Error } from '../../interfaces/error';
import { showToast } from '../../utils/showToast';
import ConfirmationModal from '../shared/ConfirmationModal';
import { DangerButton } from '../shared/DangerButton';
import { PrimaryButton } from '../shared/PrimaryButton';

interface BranchFormProps {
    selectedBranch: Branch | null;
    onCloseDrawer: () => void;
}

type BranchFormState = {
    id?: string;
    name: string;
    email: string;
    phoneNumber: string;
    country: string;
    city: string;
    street: string;
    streetNumber?: string;
    houseNumber?: string;
    zipcode?: string;
};

const initialState: BranchFormState = {
    name: '',
    email: '',
    phoneNumber: '',
    country: '',
    city: '',
    street: '',
    streetNumber: '',
    houseNumber: '',
    zipcode: '',
};

const BranchForm: FC<BranchFormProps> = ({ selectedBranch, onCloseDrawer }) => {
    const { t } = useTranslation();

    const [createBranch, { isLoading: isCreating }] = useCreateBranchMutation();
    const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();
    const [deleteBranch] = useDeleteBranchMutation();
    const [updateBranchPackage, { isLoading: isUpdatingPackage }] = useUpdateBranchPackageMutation();

    const { data: packages } = useFetchPackagesQuery();

    const [form, setForm] = useState<BranchFormState>({
        ...initialState,
        ...(selectedBranch
            ? {
                id: selectedBranch.id,
                name: selectedBranch.name,
                email: selectedBranch.email ?? '',
                phoneNumber: selectedBranch.phoneNumber ?? '',
                country: selectedBranch.country,
                city: selectedBranch.city,
                street: selectedBranch.street,
                streetNumber: selectedBranch.streetNumber ?? '',
                houseNumber: selectedBranch.houseNumber ?? '',
                zipcode: selectedBranch.zipcode ?? '',
            }
            : {}),
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [packageId, setPackageId] = useState<string>(selectedBranch?.activePackage?.packageId ?? '');
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    const isEdit = !!selectedBranch;

    useEffect(() => {
        if (selectedBranch) {
            setForm({
                ...initialState,
                id: selectedBranch.id,
                name: selectedBranch.name,
                email: selectedBranch.email ?? '',
                phoneNumber: selectedBranch.phoneNumber ?? '',
                country: selectedBranch.country,
                city: selectedBranch.city,
                street: selectedBranch.street,
                streetNumber: selectedBranch.streetNumber ?? '',
                houseNumber: selectedBranch.houseNumber ?? '',
                zipcode: selectedBranch.zipcode ?? '',
            });
            setPackageId(selectedBranch.activePackage?.packageId ?? '');
        } else {
            setForm({ ...initialState });
            setPackageId('');
            setBillingPeriod('monthly');
        }
    }, [selectedBranch]);

    const inputBaseClass =
        'w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-primary';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = (): boolean => {
        if (!form.name?.trim()) {
            showToast(t('branches.branchNameEmpty'), 'error');
            return false;
        }

        if (!form.email?.trim()) {
            showToast(t('branches.branchEmailEmpty'), 'error');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email.trim())) {
            showToast(t('branches.branchEmailInvalid'), 'error');
            return false;
        }

        if (!form.phoneNumber?.trim()) {
            showToast(t('branches.branchPhoneEmpty'), 'error');
            return false;
        }

        if (!form.country?.trim()) {
            showToast(t('countryEmpty'), 'error');
            return false;
        }

        if (!form.city?.trim()) {
            showToast(t('cityEmpty'), 'error');
            return false;
        }

        if (!form.street?.trim()) {
            showToast(t('streetEmpty'), 'error');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (isEdit && form.id) {
                await updateBranch({
                    id: form.id,
                    name: form.name,
                    phoneNumber: form.phoneNumber,
                    country: form.country,
                    city: form.city,
                    street: form.street,
                    streetNumber: form.streetNumber,
                    houseNumber: form.houseNumber,
                    zipcode: form.zipcode,
                }).unwrap();
                showToast(t('branches.branchUpdateSuccess'), 'success');
            } else {
                await createBranch({
                    name: form.name,
                    phoneNumber: form.phoneNumber,
                    country: form.country,
                    city: form.city,
                    street: form.street,
                    streetNumber: form.streetNumber,
                    houseNumber: form.houseNumber,
                    zipcode: form.zipcode,
                }).unwrap();
                showToast(t('branches.branchCreateSuccess'), 'success');
            }

            onCloseDrawer();
        } catch (error) {
            showToast(
                (error as Error).data?.message ?? t('branches.branchSaveError'),
                'error'
            );
        }
    };

    const handleDelete = async () => {
        if (!form.id) return;
        try {
            await deleteBranch(form.id).unwrap();
            showToast(t('branches.branchDeleteSuccess'), 'success');
            setShowDeleteModal(false);
            onCloseDrawer();
        } catch (error) {
            showToast(
                (error as Error).data?.message ?? t('branches.branchDeleteError'),
                'error'
            );
        }
    };

    const handleUpdatePackage = async () => {
        if (!selectedBranch || !packageId) return;

        const payload: UpdatePackageRequest = {
            packageId,
            companyId: selectedBranch.companyId,
            period: billingPeriod,
        };

        try {
            await updateBranchPackage({
                branchId: selectedBranch.id,
                data: payload,
            }).unwrap();
            showToast(t('branches.branchUpdateSuccess'), 'success');
        } catch (error) {
            showToast(
                (error as Error).data?.message ?? t('branches.branchSaveError'),
                'error'
            );
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <label className="block font-semibold mb-1">{t('branches.branchName')}</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">{t('email')}</label>
                        <input
                            type="text"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">{t('phoneNumber')}</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            className={inputBaseClass}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-semibold mb-1">{t('country')}</label>
                        <input
                            type="text"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">{t('city')}</label>
                        <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="col-span-full">
                        <label className="block font-semibold mb-1">{t('street')}</label>
                        <input
                            type="text"
                            name="street"
                            value={form.street}
                            onChange={handleChange}
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="col-span-full md:grid md:grid-cols-2 md:gap-6">
                        <div>
                            <label className="block font-semibold mb-1">{t('streetNumber')}</label>
                            <input
                                type="text"
                                name="streetNumber"
                                value={form.streetNumber}
                                onChange={handleChange}
                                className={inputBaseClass}
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-1">{t('houseNumber')}</label>
                            <input
                                type="text"
                                name="houseNumber"
                                value={form.houseNumber}
                                onChange={handleChange}
                                className={inputBaseClass}
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label className="block font-semibold mb-1">{t('zipcode')}</label>
                        <input
                            type="text"
                            name="zipcode"
                            value={form.zipcode}
                            onChange={handleChange}
                            className={inputBaseClass}
                        />
                    </div>
                </div>

                {/* Package section – doar în edit */}
                {isEdit && (
                    <div className="border-t pt-4 mt-2 space-y-3">
                        <h3 className="font-semibold">{t('branches.branchPackage')}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold mb-1">{t('branches.branchPackage')}</label>
                                <select
                                    className={inputBaseClass}
                                    value={packageId}
                                    onChange={(e) => setPackageId(e.target.value)}
                                >
                                    <option value="">{t('branches.noPackage')}</option>
                                    {packages?.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">{t('branches.billingPeriod')}</label>
                                <select
                                    className={inputBaseClass}
                                    value={billingPeriod}
                                    onChange={(e) => setBillingPeriod(e.target.value as 'monthly' | 'yearly')}
                                >
                                    <option value="monthly">{t('branches.monthly')}</option>
                                    <option value="yearly">{t('branches.yearly')}</option>
                                </select>
                            </div>
                        </div>

                        <PrimaryButton
                            type="button"
                            text={t('submit')}
                            className="w-full"
                            disabled={isUpdatingPackage || !packageId}
                            onClick={handleUpdatePackage}
                        />
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-4">
                    {isEdit && (
                        <DangerButton
                            type="button"
                            text={t('delete')}
                            onClick={() => setShowDeleteModal(true)}
                            className="w-1/4"
                        />
                    )}
                    <PrimaryButton
                        type="submit"
                        text={t('submit')}
                        disabled={isCreating || isUpdating}
                        className={isEdit ? 'w-3/4' : 'w-full'}
                    />
                </div>
            </form>

            <ConfirmationModal
                open={showDeleteModal}
                title={t('areYouSure')}
                message={t('branches.areYouSureDeleteBranch')}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
};

export default BranchForm;
