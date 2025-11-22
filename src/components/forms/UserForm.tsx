import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
  AdminUser,
  useFetchAdminCompanyBranchesQuery,
} from '../../rtk/services/admin-service';
import { useGenerateUsernameMutation } from '../../rtk/services/user-service';
import { Error } from '../../interfaces/error';
import { showToast } from '../../utils/showToast';
import ConfirmationModal from '../shared/ConfirmationModal';
import { Button } from '../shared/Button';
import DropdownMultiSelect from '../shared/DropdownMultiSelect';
import { Branch } from '../../models/Branch';
import { useForm } from '../../hooks/useForm';
import { CustomInput } from '../shared/CustomInput';
import { CustomSelect } from '../shared/CustomSelect';
import { Role } from '../../utils/enums/Role';

interface UserFormProps {
  selectedUser: AdminUser | null;
  companyId: string;
  onCloseDrawer: () => void;
}

type UserFormValues = {
  id?: string;
  firstName: string;
  lastName: string;
  password: string;
  role: Role | '';
  branchIds: string[];
};

const initialValues: UserFormValues = {
  id: '',
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

  const { data: branches = [] } = useFetchAdminCompanyBranchesQuery(companyId);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [generatedUsername, setGeneratedUsername] = useState('');

  const isEdit = Boolean(selectedUser?.id);

  const { values, errors, register, handleSubmit, setFieldValue, isSubmitting } = useForm<UserFormValues>({
    initialValues: {
      ...initialValues,
      ...(selectedUser
        ? {
            id: selectedUser.id,
            firstName: selectedUser.firstName,
            lastName: selectedUser.lastName,
            role: (selectedUser.roles?.[0] as Role) ?? '',
            branchIds: selectedUser.branches?.map((b) => b.id) ?? [],
          }
        : {}),
    },
    fields: {
      firstName: {
        validate: (value) => (!String(value ?? '').trim() ? 'adminUsers.firstNameEmpty' : null),
      },
      lastName: {
        validate: (value) => (!String(value ?? '').trim() ? 'adminUsers.lastNameEmpty' : null),
      },
      password: {
        validate: (value) => {
          if (isEdit) return null;
          const v = String(value ?? '').trim();
          if (!v) return 'adminUsers.passwordEmpty';
          if (v.length < 8) return 'adminUsers.passwordTooShort';
          return null;
        },
      },
    },
    onSubmit: async (formValues) => {
      if (!isEdit && !formValues.role) {
        showToast(t('adminUsers.roleRequired'), 'error');
        return;
      }

      if (formValues.role === Role.inspector && (!formValues.branchIds || formValues.branchIds.length === 0)) {
        showToast(t('adminUsers.branchRequired'), 'error');
        return;
      }

      try {
        if (isEdit && formValues.id) {
          await updateUser({
            companyId,
            userId: formValues.id,
            data: {
              firstName: formValues.firstName,
              lastName: formValues.lastName,
              branchIds: formValues.role === Role.inspector ? formValues.branchIds : undefined,
            },
          }).unwrap();

          showToast(t('adminUsers.userUpdateSuccess'), 'success');
        } else {
          await createUser({
            companyId,
            data: {
              firstName: formValues.firstName,
              lastName: formValues.lastName,
              password: formValues.password,
              roles: formValues.role ? [formValues.role as Role] : [],
              branchIds: formValues.role === Role.inspector ? formValues.branchIds : undefined,
            },
          }).unwrap();

          showToast(t('adminUsers.userCreateSuccess'), 'success');
        }

        onCloseDrawer();
      } catch (error) {
        showToast((error as Error).data?.message ?? t('adminUsers.userSaveError'), 'error');
      }
    },
  });

  useEffect(() => {
    if (selectedUser) {
      setFieldValue('id', selectedUser.id ?? '');
      setFieldValue('firstName', selectedUser.firstName ?? '');
      setFieldValue('lastName', selectedUser.lastName ?? '');
      setFieldValue('password', '');
      setFieldValue('role', (selectedUser.roles?.[0] as Role) ?? '');
      setFieldValue('branchIds', selectedUser.branches?.map((b) => b.id) ?? []);
      setGeneratedUsername(selectedUser.username);
    } else {
      setFieldValue('id', '');
      setFieldValue('firstName', '');
      setFieldValue('lastName', '');
      setFieldValue('password', '');
      setFieldValue('role', '');
      setFieldValue('branchIds', []);
      setGeneratedUsername('');
    }
  }, [selectedUser]); // aici era bucla: am scos setFieldValue din deps

  useEffect(() => {
    if (isEdit) return;
    if (!values.firstName.trim() || !values.lastName.trim()) return;

    const timeoutId = window.setTimeout(async () => {
      try {
        const result = await generateUsername({
          firstName: values.firstName,
          lastName: values.lastName,
          companyId,
        }).unwrap();

        setGeneratedUsername(result.username);
      } catch (error) {
        console.error(error);
      }
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [values.firstName, values.lastName, isEdit, generateUsername, companyId]);

  const onSubmit = handleSubmit();

  const handleRoleChange = (value: string) => {
    const role = (value as Role) || '';
    setFieldValue('role', role);

    if (role !== Role.inspector) {
      setFieldValue('branchIds', []);
    }
  };

  const handleBranchesChange = (ids: string[]) => {
    setFieldValue('branchIds', ids);
  };

  const handleDelete = async () => {
    if (!values.id) return;
    try {
      await deleteUser({ companyId, userId: values.id }).unwrap();
      showToast(t('adminUsers.userDeleteSuccess'), 'success');
      setShowDeleteModal(false);
      onCloseDrawer();
    } catch (error) {
      showToast((error as Error).data?.message ?? t('adminUsers.userDeleteError'), 'error');
    }
  };

  const isInspector = values.role === Role.inspector;
  const isOwner = values.role === Role.owner;

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            label={t('firstName')}
            {...register('firstName')}
            error={errors.firstName && t(errors.firstName)}
            wrapperClassName="mb-0"
          />
          <CustomInput
            label={t('lastName')}
            {...register('lastName')}
            error={errors.lastName && t(errors.lastName)}
            wrapperClassName="mb-0"
          />
        </div>

        <div>
          <CustomInput
            label={t('adminUsers.username')}
            name="username"
            value={generatedUsername}
            disabled
            className="bg-background/60 cursor-not-allowed"
            wrapperClassName="mb-1"
            placeholder={isEdit ? generatedUsername : t('adminUsers.usernameWillBeGenerated')}
          />

          {!isEdit && <p className="text-xs font-body text-text/60 mt-1">{t('adminUsers.usernameWillBeGenerated')}</p>}
        </div>

        {!isEdit && (
          <CustomInput
            type="password"
            label={t('password')}
            {...register('password')}
            error={errors.password && t(errors.password)}
            placeholder={t('adminUsers.minLength8')}
          />
        )}

        {!isEdit && (
          <CustomSelect
            label={t('adminUsers.selectRole')}
            value={values.role || ''}
            onChange={handleRoleChange}
            options={[
              { value: '', label: t('adminUsers.chooseRole') },
              { value: Role.owner, label: t('adminUsers.owner') },
              { value: Role.inspector, label: t('adminUsers.inspector') },
            ]}
          />
        )}

        {isInspector && (
          <DropdownMultiSelect
            label={t('adminUsers.selectBranches')}
            options={branches}
            selectedIds={values.branchIds}
            onSelectionChange={handleBranchesChange}
            getOptionId={(branch: Branch) => branch.id}
            getOptionLabel={(branch: Branch) => branch.name}
            placeholder={t('adminUsers.selectBranches')}
            emptyMessage={t('adminUsers.noBranchesAvailable')}
            selectedCountMessage={(count) => `${count} ${t('adminUsers.branchesSelected')}`}
          />
        )}

        {isOwner && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">ℹ️ {t('adminUsers.ownerNote')}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          {isEdit && (
            <Button type="button" variant="danger" size="md" className="w-1/3" onClick={() => setShowDeleteModal(true)}>
              {t('delete')}
            </Button>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className={isEdit ? 'w-2/3' : 'w-full'}
            loading={isCreating || isUpdating || isSubmitting}
          >
            {t('submit')}
          </Button>
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
