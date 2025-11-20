import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    useCreateAdminUserMutation,
    useUpdateAdminUserMutation,
    useDeleteAdminUserMutation,
    AdminUser,
} from '../../rtk/services/admin-service';
import { useFetchAdminCompanyBranchesQuery } from '../../rtk/services/admin-service';
import { useGenerateUsernameMutation } from '../../rtk/services/user-service';
import { Error } from '../../interfaces/error';
import { showToast } from '../../utils/showToast';
import ConfirmationModal from '../shared/ConfirmationModal';
import { DangerButton } from '../shared/DangerButton';
import { PrimaryButton } from '../shared/PrimaryButton';
import DropdownMultiSelect from '../shared/DropdownMultiSelect';
import { Branch } from '../../models/Branch';

interface UserFormProps {
    selectedUser: AdminUser | null;
    companyId: string;
    onCloseDrawer: () => void;
}

type UserFormState = {
    id?: string;
    firstName: string;
    lastName: string;
    password: string;
    role: 'owner' | 'inspector' | '';
    branchIds: string[];
};

const initialState: UserFormState = {
    firstName: '',
    lastName: '',
    password: '',
    role: '',
    branchIds: [],
};

const UserForm: FC<UserFormProps> = ({ selectedUser, companyId, onCloseDrawer }) => {
    const { t } = useTranslation();

    const [createUser, { isLoading: isCreating }] = useCreateAdminUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateAdminUserMutation();
    const [deleteUser] = useDeleteAdminUserMutation();
    const [generateUsername] = useGenerateUsernameMutation();

    const { data: branches } = useFetchAdminCompanyBranchesQuery(companyId);

    const [form, setForm] = useState<UserFormState>(initialState);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [generatedUsername, setGeneratedUsername] = useState('');

    const isEdit = !!selectedUser;

    useEffect(() => {
        if (selectedUser) {
            setForm({
                id: selectedUser.id,
                firstName: selectedUser.firstName,
                lastName: selectedUser.lastName,
                password: '',
                role: selectedUser.roles[0] as 'owner' | 'inspector',
                branchIds: selectedUser.branches?.map(b => b.id) || [],
            });
            setGeneratedUsername(selectedUser.username);
        } else {
            setForm(initialState);
            setGeneratedUsername('');
        }
    }, [selectedUser]);

    useEffect(() => {
        if (isEdit) return;
        if (!form.firstName?.trim() || !form.lastName?.trim()) return;

        const timeoutId = setTimeout(async () => {
            try {
                const result = await generateUsername({
                    firstName: form.firstName,
                    lastName: form.lastName,
                    companyId: companyId,
                }).unwrap();

                setGeneratedUsername(result.username);
            } catch (error) {
                console.error('Error generating username:', error);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [form.firstName, form.lastName, isEdit, generateUsername, companyId]);

    const inputBaseClass =
        'w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-primary';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const role = e.target.value as 'owner' | 'inspector' | '';
        setForm((prev) => ({
            ...prev,
            role,
            branchIds: role === 'owner' ? [] : prev.branchIds,
        }));
    };

    const validateForm = (): boolean => {
        if (!form.firstName?.trim()) {
            showToast(t('adminUsers.firstNameEmpty'), 'error');
            return false;
        }

        if (!form.lastName?.trim()) {
            showToast(t('adminUsers.lastNameEmpty'), 'error');
            return false;
        }

        if (!isEdit && !form.password?.trim()) {
            showToast(t('adminUsers.passwordEmpty'), 'error');
            return false;
        }

        if (!isEdit && form.password && form.password.length < 8) {
            showToast(t('adminUsers.passwordTooShort'), 'error');
            return false;
        }

        if (!form.role) {
            showToast(t('adminUsers.roleRequired'), 'error');
            return false;
        }

        if (form.role === 'inspector' && form.branchIds.length === 0) {
            showToast(t('adminUsers.branchRequired'), 'error');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (isEdit && form.id) {
                await updateUser({
                    companyId,
                    userId: form.id,
                    data: {
                        firstName: form.firstName,
                        lastName: form.lastName,
                        branchIds: form.role === 'inspector' ? form.branchIds : undefined,
                    },
                }).unwrap();
                showToast(t('adminUsers.userUpdateSuccess'), 'success');
            } else {
                await createUser({
                    companyId,
                    data: {
                        firstName: form.firstName,
                        lastName: form.lastName,
                        password: form.password,
                        roles: [form.role.toUpperCase()],
                        branchIds: form.role === 'inspector' ? form.branchIds : undefined,
                    },
                }).unwrap();
                showToast(t('adminUsers.userCreateSuccess'), 'success');
            }

            onCloseDrawer();
        } catch (error) {
            showToast(
                (error as Error).data?.message ?? t('adminUsers.userSaveError'),
                'error'
            );
        }
    };

    const handleDelete = async () => {
        if (!form.id) return;
        try {
            await deleteUser({ companyId, userId: form.id }).unwrap();
            showToast(t('adminUsers.userDeleteSuccess'), 'success');
            setShowDeleteModal(false);
            onCloseDrawer();
        } catch (error) {
            showToast(
                (error as Error).data?.message ?? t('adminUsers.userDeleteError'),
                'error'
            );
        }
    };

    const isOwner = form.role === 'owner';
    const isInspector = form.role === 'inspector';

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                <div>
                    <label className="block font-semibold mb-1">{t('adminUsers.username')}</label>
                    <input
                        type="text"
                        name="username"
                        value={generatedUsername}
                        disabled
                        className={`${inputBaseClass} bg-gray-100 cursor-not-allowed`}
                        placeholder={isEdit ? generatedUsername : t('adminUsers.usernameWillBeGenerated')}
                    />
                    {!isEdit && (
                        <p className="text-sm text-gray-500 mt-1">
                            {t('adminUsers.usernameWillBeGenerated')}
                        </p>
                    )}
                </div>

                {!isEdit && (
                    <div>
                        <label className="block font-semibold mb-1">{t('password')}</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className={inputBaseClass}
                            placeholder={t('adminUsers.minLength8')}
                        />
                    </div>
                )}

                {!isEdit && (
                    <div>
                        <label className="block font-semibold mb-1">{t('adminUsers.selectRole')}</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleRoleChange}
                            className={inputBaseClass}
                        >
                            <option value="">{t('adminUsers.chooseRole')}</option>
                            <option value="owner">{t('adminUsers.owner')}</option>
                            <option value="inspector">{t('adminUsers.inspector')}</option>
                        </select>
                    </div>
                )}

                {isInspector && (
                    <DropdownMultiSelect
                        label={t('adminUsers.selectBranches')}
                        options={branches || []}
                        selectedIds={form.branchIds}
                        onSelectionChange={(selectedIds) => setForm(prev => ({ ...prev, branchIds: selectedIds }))}
                        getOptionId={(branch: Branch) => branch.id}
                        getOptionLabel={(branch: Branch) => branch.name}
                        placeholder={t('adminUsers.selectBranches')}
                        emptyMessage={t('adminUsers.noBranchesAvailable')}
                        selectedCountMessage={(count) => `${count} ${t('adminUsers.branchesSelected')}`}
                    />
                )}

                {isOwner && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                            ℹ️ {t('adminUsers.ownerNote')}
                        </p>
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
                message={t('adminUsers.areYouSureDeleteUser')}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
};

export default UserForm;