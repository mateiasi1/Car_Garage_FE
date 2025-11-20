import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Error } from '../../interfaces/error.tsx';
import {
    useCreateAdminCompanyMutation,
    useDeleteAdminCompanyMutation,
    useUpdateAdminCompanyMutation,
} from '../../rtk/services/admin-service.tsx';
import { showToast } from '../../utils/showToast.ts';
import ConfirmationModal from '../shared/ConfirmationModal.tsx';
import { DangerButton } from '../shared/DangerButton.tsx';
import { PrimaryButton } from '../shared/PrimaryButton.tsx';

interface CompanyFormProps {
    selectedCompany: Partial<CompanyFormState> | null;
    onCloseDrawer: () => void;
}

type CompanyFormState = {
    id?: string;
    name: string;
    shortName: string;
    email: string;
    phoneNumber: string;
    country: string;
    city: string;
    street: string;
    streetNumber?: string;
    houseNumber?: string;
    zipcode?: string;
};

const initialState: CompanyFormState = {
    name: '',
    shortName: '',
    email: '',
    phoneNumber: '',
    country: '',
    city: '',
    street: '',
    streetNumber: '',
    houseNumber: '',
    zipcode: '',
};

const CompanyForm: FC<CompanyFormProps> = ({ selectedCompany, onCloseDrawer }) => {
    const { t } = useTranslation();
    const [createCompany, { isLoading: isCreating }] = useCreateAdminCompanyMutation();
    const [updateCompany, { isLoading: isUpdating }] = useUpdateAdminCompanyMutation();
    const [deleteCompany] = useDeleteAdminCompanyMutation();

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const isEdit = Boolean(selectedCompany);

    const [form, setForm] = useState<CompanyFormState>({
        ...initialState,
        ...(selectedCompany ?? {}),
    });

    useEffect(() => {
        if (selectedCompany) {
            setForm((prev) => ({
                ...prev,
                ...selectedCompany,
            }));
        } else {
            setForm({ ...initialState });
        }
    }, [selectedCompany]);

    const inputBaseClass =
        'w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-primary';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Limit shortName to 15 characters
        if (name === 'shortName' && value.length > 15) {
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = (): boolean => {
        if (!form.name?.trim()) {
            showToast(t('companyNameEmpty'), 'error');
            return false;
        }

        if (!form.shortName?.trim()) {
            showToast(t('companyShortNameEmpty'), 'error');
            return false;
        }

        if (form.shortName.length > 15) {
            showToast(t('companyShortNameTooLong'), 'error');
            return false;
        }

        if (!form.email?.trim()) {
            showToast(t('companyEmailEmpty'), 'error');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email?.trim() || !emailRegex.test(form.email.trim())) {
            showToast(t('companyEmailInvalid'), 'error');
            return false;
        }

        if (!form.phoneNumber?.trim()) {
            showToast(t('companyPhoneEmpty'), 'error');
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
                // Only send the fields that should be updated
                const payload = {
                    name: form.name,
                    shortName: form.shortName,
                    email: form.email,
                    phoneNumber: form.phoneNumber,
                    country: form.country,
                    city: form.city,
                    street: form.street,
                    streetNumber: form.streetNumber,
                    houseNumber: form.houseNumber,
                    zipcode: form.zipcode,
                };
                await updateCompany({ companyId: form.id, ...payload }).unwrap();
                showToast(t('companyUpdateSuccess'), 'success');
                onCloseDrawer();
            } else {
                // For create, send all fields except id
                const payload = {
                    name: form.name,
                    shortName: form.shortName,
                    email: form.email,
                    phoneNumber: form.phoneNumber,
                    country: form.country,
                    city: form.city,
                    street: form.street,
                    streetNumber: form.streetNumber,
                    houseNumber: form.houseNumber,
                    zipcode: form.zipcode,
                };
                await createCompany(payload).unwrap();
                showToast(t('companyCreateSuccess'), 'success');
                onCloseDrawer();
            }
        } catch (error) {
            showToast((error as Error).data?.message ?? t('companySaveError'), 'error');
        }
    };

    const handleDelete = async () => {
        if (!form.id) return;
        try {
            await deleteCompany(form.id).unwrap();
            showToast(t('companyDeleteSuccess'), 'success');
            setShowDeleteModal(false);
            onCloseDrawer();
        } catch (error) {
            showToast((error as Error).data?.message ?? t('companyDeleteError'), 'error');
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <label className="block font-semibold mb-1">{t('companyName')}</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} className={inputBaseClass} />
                    </div>

                    <div className="col-span-full">
                        <label className="block font-semibold mb-1">
                            {t('companyShortName')} <span className="text-gray-500 text-sm">({t('maxCharacters', { max: 15 })})</span>
                        </label>
                        <input
                            type="text"
                            name="shortName"
                            value={form.shortName}
                            onChange={handleChange}
                            disabled={isEdit}
                            maxLength={15}
                            className={`${inputBaseClass} ${isEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            placeholder={t('companyShortNamePlaceholder')}
                        />
                        {isEdit && (
                            <p className="text-sm text-gray-500 mt-1">{t('companyShortNameCannotBeChanged')}</p>
                        )}
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">{t('email')}</label>
                        <input type="text" name="email" value={form.email} onChange={handleChange} className={inputBaseClass} />
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
                        <input type="text" name="country" value={form.country} onChange={handleChange} className={inputBaseClass} />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">{t('city')}</label>
                        <input type="text" name="city" value={form.city} onChange={handleChange} className={inputBaseClass} />
                    </div>

                    <div className="col-span-full">
                        <label className="block font-semibold mb-1">{t('street')}</label>
                        <input type="text" name="street" value={form.street} onChange={handleChange} className={inputBaseClass} />
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
                        <input type="text" name="zipcode" value={form.zipcode} onChange={handleChange} className={inputBaseClass} />
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    {isEdit && (
                        <DangerButton type="button" text={t('delete')} onClick={() => setShowDeleteModal(true)} className="w-1/4" />
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
                message={t('areYouSureDeleteCompany')}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
};

export default CompanyForm;