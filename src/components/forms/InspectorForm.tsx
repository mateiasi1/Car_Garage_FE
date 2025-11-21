import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateInspectorDTO, UpdateInspectorDTO } from '../../interfaces/inspector.payload';
import {
  useCreateInspectorMutation,
  useUpdateInspectorMutation,
  useDeleteInspectorMutation,
} from '../../rtk/services/inspector-service';
import { useFetchCompanyBranchesQuery } from '../../rtk/services/company-service';
import { useGenerateUsernameMutation } from '../../rtk/services/user-service';
import { showToast } from '../../utils/showToast';
import { Branch } from '../../models/Branch';
import { UserBranch } from '../../models/UserBranch';
import DropdownMultiSelect from '../shared/DropdownMultiSelect';
import { CustomInput } from '../shared/CustomInput';
import { Button } from '../shared/Button';
import ConfirmationModal from '../shared/ConfirmationModal';
import { useForm } from '../../hooks/useForm';

interface InspectorFormProps {
  selectedInspector: {
    id?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    branches?: UserBranch[];
  } | null;
  onCloseDrawer: () => void;
}

type InspectorFormValues = {
  id?: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  branchIds: string[];
};

const InspectorForm: FC<InspectorFormProps> = ({ selectedInspector, onCloseDrawer }) => {
  const { t } = useTranslation();
  const [createInspector, { isLoading: isCreating }] = useCreateInspectorMutation();
  const [updateInspector, { isLoading: isUpdating }] = useUpdateInspectorMutation();
  const [deleteInspector] = useDeleteInspectorMutation();
  const [generateUsername] = useGenerateUsernameMutation();
  const { data: branches = [], isLoading: branchesLoading } = useFetchCompanyBranchesQuery();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isEdit = Boolean(selectedInspector?.id);

  const { values, errors, register, handleSubmit, setFieldValue, isSubmitting } = useForm<InspectorFormValues>({
    initialValues: {
      id: selectedInspector?.id ?? '',
      firstName: selectedInspector?.firstName ?? '',
      lastName: selectedInspector?.lastName ?? '',
      username: selectedInspector?.username ?? '',
      password: '',
      branchIds: selectedInspector?.branches?.map((b) => b.id) ?? [],
    },
    fields: {
      firstName: { required: true },
      lastName: { required: true },
      password: {
        validate: (value) => {
          if (isEdit) return null;
          const pwd = String(value ?? '').trim();
          if (!pwd) return 'passwordEmpty';
          if (pwd.length < 6) return 'passwordTooShort';
          return null;
        },
      },
      branchIds: {
        validate: (value) => {
          const arr = Array.isArray(value) ? value : [];
          if (arr.length === 0) return 'selectAtLeastOneBranch';
          return null;
        },
      },
    },
    onSubmit: async (formValues) => {
      try {
        if (isEdit && formValues.id) {
          const payload: UpdateInspectorDTO = {
            id: formValues.id,
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            branchIds: formValues.branchIds,
          };
          await updateInspector(payload).unwrap();
          showToast(t('inspectorUpdateSuccess'), 'success');
        } else {
          const payload: CreateInspectorDTO = {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            password: formValues.password,
            branchIds: formValues.branchIds,
          };
          await createInspector(payload).unwrap();
          showToast(t('inspectorCreateSuccess'), 'success');
        }
        onCloseDrawer();
      } catch {
        showToast(isEdit ? t('inspectorUpdateError') : t('inspectorCreateError'), 'error');
      }
    },
  });

  useEffect(() => {
    if (isEdit) return;
    if (!values.firstName.trim() || !values.lastName.trim()) return;

    const timeoutId = window.setTimeout(async () => {
      try {
        const result = await generateUsername({
          firstName: values.firstName,
          lastName: values.lastName,
        }).unwrap();

        setFieldValue('username', result.username);
      } catch {
        /* silent */
      }
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [values.firstName, values.lastName, isEdit, generateUsername, setFieldValue]);

  const handleBranchSelectionChange = (selectedIds: string[]) => {
    setFieldValue('branchIds', selectedIds);
  };

  const onDelete = async () => {
    if (!values.id) return;
    try {
      await deleteInspector(values.id).unwrap();
      showToast(t('inspectorDeleteSuccess'), 'success');
      setShowDeleteModal(false);
      onCloseDrawer();
    } catch {
      showToast(t('inspectorDeleteError'), 'error');
    }
  };

  if (branchesLoading) {
    return <div className="p-4 text-sm font-body text-text/80">{t('loading')}</div>;
  }

  const onSubmit = handleSubmit();

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            label={t('lastName')}
            {...register('lastName')}
            error={errors.lastName && t(errors.lastName)}
            wrapperClassName="mb-0"
          />
          <CustomInput
            label={t('firstName')}
            {...register('firstName')}
            error={errors.firstName && t(errors.firstName)}
            wrapperClassName="mb-0"
          />

          <div className="md:col-span-2">
            <CustomInput
              label={t('username')}
              {...register('username')}
              disabled
              className="bg-background/60 cursor-not-allowed"
              wrapperClassName="mb-1"
            />
            {!isEdit && <p className="text-xs font-body text-text/60 mt-1">{t('usernameGeneratedAutomatically')}</p>}
          </div>
        </div>

        <div>
          <DropdownMultiSelect
            label={t('assignedBranches')}
            options={branches}
            selectedIds={values.branchIds}
            onSelectionChange={handleBranchSelectionChange}
            getOptionId={(branch: Branch) => branch.id}
            getOptionLabel={(branch: Branch) => branch.name}
            placeholder={t('selectBranches')}
            emptyMessage={t('noBranchesAvailable')}
            selectedCountMessage={(count) => `${count} ${t('branchesSelected')}`}
          />
          {errors.branchIds && <p className="text-error text-sm mt-1 font-body">{t(errors.branchIds)}</p>}
        </div>

        {!isEdit && (
          <CustomInput
            type="password"
            label={t('password')}
            {...register('password')}
            error={errors.password && t(errors.password)}
          />
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
        message={t('areYouSureDeleteInspector')}
        onConfirm={onDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
};

export default InspectorForm;
