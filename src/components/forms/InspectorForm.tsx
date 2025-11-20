import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateInspectorDTO, UpdateInspectorDTO } from '../../interfaces/inspector.payload.ts';
import {
    useCreateInspectorMutation,
    useUpdateInspectorMutation,
    useDeleteInspectorMutation,
} from '../../rtk/services/inspector-service.tsx';
import { useFetchCompanyBranchesQuery } from '../../rtk/services/company-service.tsx';
import { useGenerateUsernameMutation } from '../../rtk/services/user-service.tsx';
import { showToast } from '../../utils/showToast.ts';
import PasswordInput from '../shared/PasswordInput.tsx';
import { PrimaryButton } from '../shared/PrimaryButton.tsx';
import ConfirmationModal from '../shared/ConfirmationModal.tsx';
import { DangerButton } from '../shared/DangerButton.tsx';
import {Branch} from "../../models/Branch.ts";
import {UserBranch} from "../../models/UserBranch.ts";
import DropdownMultiSelect from "../shared/DropdownMultiSelect.tsx";

interface InspectorFormProps {
    selectedInspector: Partial<InspectorFormState> | null;
    onCloseDrawer: () => void;
}

type InspectorFormState = {
    id?: string;
    firstName: string;
    lastName: string;
    username: string;
    password?: string;
    branchIds: string[];
    branches?: UserBranch[];
};

const initialState: InspectorFormState = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    branchIds: [],
    branches: [],
};

const InspectorForm: FC<InspectorFormProps> = ({ selectedInspector, onCloseDrawer }) => {
    const { t } = useTranslation();
    const [createInspector, { isLoading: isCreating }] = useCreateInspectorMutation();
    const [updateInspector, { isLoading: isUpdating }] = useUpdateInspectorMutation();
    const [deleteInspector] = useDeleteInspectorMutation();
    const [generateUsername] = useGenerateUsernameMutation();
    const { data: branches = [], isLoading: branchesLoading } = useFetchCompanyBranchesQuery();

    const [showPassword, setShowPassword] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const isEdit = Boolean(selectedInspector);

    const [form, setForm] = useState<InspectorFormState>(initialState);

    useEffect(() => {
        if (selectedInspector) {
            const branchIds = selectedInspector.branches?.map((b: UserBranch) => b.id) || selectedInspector.branchIds || [];

            setForm({
                id: selectedInspector.id,
                firstName: selectedInspector.firstName || '',
                lastName: selectedInspector.lastName || '',
                username: selectedInspector.username || '',
                password: '',
                branchIds: branchIds,
                branches: selectedInspector.branches,
            });
        } else {
            setForm(initialState);
            setShowDeleteModal(false);
        }
    }, [selectedInspector]);

    useEffect(() => {
        if (isEdit) return;
        if (!form.firstName?.trim() || !form.lastName?.trim()) return;

        const timeoutId = setTimeout(async () => {
            try {
                const result = await generateUsername({
                    firstName: form.firstName,
                    lastName: form.lastName,
                }).unwrap();

                setForm((prev) => ({ ...prev, username: result.username }));
            } catch (error) {
                console.error('Error generating username:', error);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [form.firstName, form.lastName, isEdit, generateUsername]);

    const inputBaseClass =
        'w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-primary';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleBranchSelectionChange = (selectedIds: string[]) => {
        setForm((prev) => ({ ...prev, branchIds: selectedIds }));
    };

    const validateForm = (): boolean => {
        if (!form.username?.trim()) {
            showToast(t('usernameEmpty'), 'error');
            return false;
        }
        if (!form.firstName?.trim()) {
            showToast(t('firstNameEmpty'), 'error');
            return false;
        }
        if (!form.lastName?.trim()) {
            showToast(t('lastNameEmpty'), 'error');
            return false;
        }
        if (form.branchIds.length === 0) {
            showToast(t('selectAtLeastOneBranch'), 'error');
            return false;
        }

        if (!isEdit) {
            if (!form.password?.trim()) {
                showToast(t('passwordEmpty'), 'error');
                return false;
            }
            if (form.password.length < 6) {
                showToast(t('passwordTooShort'), 'error');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (isEdit && form.id) {
                const { firstName, lastName, branchIds } = form;
                const payload: UpdateInspectorDTO = { id: form.id, firstName, lastName, branchIds };
                await updateInspector(payload).unwrap();
                showToast(t('inspectorUpdateSuccess'), 'success');
                onCloseDrawer();
            } else {
                const { firstName, lastName, branchIds } = form;
                const payload: CreateInspectorDTO = {
                    firstName,
                    lastName,
                    password: form.password || '',
                    branchIds,
                };
                await createInspector(payload).unwrap();
                showToast(t('inspectorCreateSuccess'), 'success');
                onCloseDrawer();
            }
        } catch (error) {
            showToast(isEdit ? t('inspectorUpdateError') : t('inspectorCreateError'), 'error');
        }
    };

    const handleDelete = async () => {
        if (!form.id) return;
        try {
            await deleteInspector(form.id).unwrap();
            showToast(t('inspectorDeleteSuccess'), 'success');
            setShowDeleteModal(false);
            onCloseDrawer();
        } catch (error) {
            showToast(t('inspectorDeleteError'), 'error');
        }
    };

    if (branchesLoading) {
        return <div className="p-4">{t('loading')}</div>;
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-semibold mb-1">{t('lastName')}</label>
                        <input
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">{t('firstName')}</label>
                        <input
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="col-span-full">
                        <label className="block font-semibold mb-1">{t('username')}</label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            disabled
                            className={`${inputBaseClass} bg-gray-100 cursor-not-allowed`}
                            placeholder={isEdit ? form.username : t('autoGeneratedUsername')}
                        />
                        {!isEdit && (
                            <p className="text-sm text-gray-500 mt-1">{t('usernameGeneratedAutomatically')}</p>
                        )}
                    </div>
                </div>

                <DropdownMultiSelect
                    label={t('assignedBranches')}
                    options={branches}
                    selectedIds={form.branchIds}
                    onSelectionChange={handleBranchSelectionChange}
                    getOptionId={(branch: Branch) => branch.id}
                    getOptionLabel={(branch: Branch) => branch.name}
                    placeholder={t('selectBranches')}
                    emptyMessage={t('noBranchesAvailable')}
                    selectedCountMessage={(count) => `${count} ${t('branchesSelected')}`}
                />

                {!isEdit && (
                    <div>
                        <PasswordInput
                            name="password"
                            label={t('password')}
                            value={form.password || ''}
                            showPassword={showPassword}
                            onChange={handleChange}
                            onToggleVisibility={() => setShowPassword(!showPassword)}
                        />
                    </div>
                )}

                <div className="flex justify-end gap-3">
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
                message={t('areYouSureDeleteInspector')}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
};

export default InspectorForm;