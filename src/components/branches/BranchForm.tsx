import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    useCreateAdminBranchMutation,
    useUpdateAdminBranchMutation,
    useDeleteAdminBranchMutation,
} from '../../rtk/services/admin-service.tsx';
import { Branch } from '../../models/Branch.ts';
import { Error } from '../../interfaces/error.tsx';
import { showToast } from '../../utils/showToast.ts';
import ConfirmationModal from '../shared/ConfirmationModal.tsx';
import { DangerButton } from '../shared/DangerButton.tsx';
import { PrimaryButton } from '../shared/PrimaryButton.tsx';

interface BranchFormProps {
    selectedBranch: Branch | null;
    companyId: string; // ⭐ Add companyId prop
    onCloseDrawer: () => void;
}

type BranchFormState = {
    id?: string;
    name: string;
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
    phoneNumber: '',
    country: '',
    city: '',
    street: '',
    streetNumber: '',
    houseNumber: '',
    zipcode: '',
};

const BranchForm: FC<BranchFormProps> = ({ selectedBranch, companyId, onCloseDrawer }) => {
    const { t } = useTranslation();

    const [createBranch, { isLoading: isCreating }] = useCreateAdminBranchMutation();
    const [updateBranch, { isLoading: isUpdating }] = useUpdateAdminBranchMutation();
    const [deleteBranch] = useDeleteAdminBranchMutation();

    const [form, setForm] = useState<BranchFormState>({
        ...initialState,
        ...(selectedBranch
            ? {
                id: selectedBranch.id,
                name: selectedBranch.name,
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

    const isEdit = !!selectedBranch;

    useEffect(() => {
        if (selectedBranch) {
            setForm({
                ...initialState,
                id: selectedBranch.id,
                name: selectedBranch.name,
                phoneNumber: selectedBranch.phoneNumber ?? '',
                country: selectedBranch.country,
                city: selectedBranch.city,
                street: selectedBranch.street,
                streetNumber: selectedBranch.streetNumber ?? '',
                houseNumber: selectedBranch.houseNumber ?? '',
                zipcode: selectedBranch.zipcode ?? '',
            });
        } else {
            setForm({ ...initialState });
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
            showToast(t('branch.branchNameEmpty'), 'error');
            return false;
        }

        if (!form.phoneNumber?.trim()) {
            showToast(t('branch.branchPhoneEmpty'), 'error');
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
                    companyId,
                    branchId: form.id,
                    name: form.name,
                    phoneNumber: form.phoneNumber,
                    country: form.country,
                    city: form.city,
                    street: form.street,
                    streetNumber: form.streetNumber,
                    houseNumber: form.houseNumber,
                    zipcode: form.zipcode,
                }).unwrap();
                showToast(t('branch.branchUpdateSuccess'), 'success');
            } else {
                await createBranch({
                    companyId,
                    data: {
                        name: form.name,
                        phoneNumber: form.phoneNumber,
                        country: form.country,
                        city: form.city,
                        street: form.street,
                        streetNumber: form.streetNumber,
                        houseNumber: form.houseNumber,
                        zipcode: form.zipcode,
                    },
                }).unwrap();
                showToast(t('branch.branchCreateSuccess'), 'success');
            }

            onCloseDrawer();
        } catch (error) {
            showToast(
                (error as Error).data?.message ?? t('branch.branchSaveError'),
                'error'
            );
        }
    };

    const handleDelete = async () => {
        if (!form.id) return;
        try {
            await deleteBranch({ companyId, branchId: form.id }).unwrap();
            showToast(t('branch.branchDeleteSuccess'), 'success');
            setShowDeleteModal(false);
            onCloseDrawer();
        } catch (error) {
            showToast(
                (error as Error).data?.message ?? t('branch.branchDeleteError'),
                'error'
            );
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <label className="block font-semibold mb-1">{t('branch.branchName')}</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="col-span-full">
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
                message={t('branch.areYouSureDeleteBranch')}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
};

export default BranchForm;