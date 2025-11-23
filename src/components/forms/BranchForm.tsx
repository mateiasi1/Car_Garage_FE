import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCreateAdminBranchMutation,
  useUpdateAdminBranchMutation,
  useDeleteAdminBranchMutation,
} from '../../rtk/services/admin-service';
import {
  useCreateBranchMutation as useOwnerCreateBranchMutation,
  useUpdateBranchMutation as useOwnerUpdateBranchMutation,
  useDeleteBranchMutation as useOwnerDeleteBranchMutation,
} from '../../rtk/services/branch-service';
import { Branch } from '../../models/Branch';
import { Error } from '../../interfaces/error';
import { showToast } from '../../utils/showToast';
import ConfirmationModal from '../shared/ConfirmationModal';
import { Button } from '../shared/Button';
import { useForm } from '../../hooks/useForm';
import { CustomInput } from '../shared/CustomInput';
import { PhoneNumberRoInput } from '../PhoneNumberRoInput';

interface BranchFormProps {
  selectedBranch: Branch | null;
  companyId?: string;
  onCloseDrawer: () => void;
  isOwnerMode?: boolean;
}

type BranchFormValues = {
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

const initialValues: BranchFormValues = {
  id: '',
  name: '',
  phoneNumber: '',
  country: '',
  city: '',
  street: '',
  streetNumber: '',
  houseNumber: '',
  zipcode: '',
};

const BranchForm: FC<BranchFormProps> = ({ selectedBranch, companyId, onCloseDrawer, isOwnerMode }) => {
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isEdit = Boolean(selectedBranch?.id);
  const isOwner = Boolean(isOwnerMode);

  // --- Mutations ADMIN ---
  const [createAdminBranch, { isLoading: isCreatingAdmin }] = useCreateAdminBranchMutation();
  const [updateAdminBranch, { isLoading: isUpdatingAdmin }] = useUpdateAdminBranchMutation();
  const [deleteAdminBranch] = useDeleteAdminBranchMutation();

  // --- Mutations OWNER (branch-service) ---
  const [createOwnerBranch, { isLoading: isCreatingOwner }] = useOwnerCreateBranchMutation();
  const [updateOwnerBranch, { isLoading: isUpdatingOwner }] = useOwnerUpdateBranchMutation();
  const [deleteOwnerBranch] = useOwnerDeleteBranchMutation();

  const { values, errors, register, handleSubmit, isSubmitting, setFieldValue } = useForm<BranchFormValues>({
    initialValues: selectedBranch
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
      : initialValues,
    fields: {
      name: {
        validate: (value) => {
          const v = String(value ?? '').trim();
          if (!v) return 'branch.branchNameEmpty';
          return null;
        },
      },
      phoneNumber: {
        validate: (value) => {
          const v = String(value ?? '').trim();
          if (!v) return 'branch.branchPhoneEmpty';
          return null;
        },
      },
      country: {
        validate: (value) => {
          const v = String(value ?? '').trim();
          if (!v) return 'countryEmpty';
          return null;
        },
      },
      city: {
        validate: (value) => {
          const v = String(value ?? '').trim();
          if (!v) return 'cityEmpty';
          return null;
        },
      },
      street: {
        validate: (value) => {
          const v = String(value ?? '').trim();
          if (!v) return 'streetEmpty';
          return null;
        },
      },
    },
    onSubmit: async (formValues) => {
      const payload = {
        name: formValues.name,
        phoneNumber: formValues.phoneNumber,
        country: formValues.country,
        city: formValues.city,
        street: formValues.street,
        streetNumber: formValues.streetNumber,
        houseNumber: formValues.houseNumber,
        zipcode: formValues.zipcode,
      };

      try {
        // OWNER MODE: branch-service
        if (isOwner) {
          if (isEdit && formValues.id) {
            await updateOwnerBranch({
              branchId: formValues.id,
              ...payload,
            }).unwrap();
            showToast(t('branch.branchUpdateSuccess'), 'success');
          } else {
            await createOwnerBranch(payload).unwrap();
            showToast(t('branch.branchCreateSuccess'), 'success');
          }
        } else {
          // ADMIN MODE: admin-service (ca înainte)
          if (isEdit && formValues.id) {
            await updateAdminBranch({
              companyId: companyId as string,
              branchId: formValues.id,
              ...payload,
            }).unwrap();
            showToast(t('branch.branchUpdateSuccess'), 'success');
          } else {
            await createAdminBranch({
              companyId: companyId as string,
              data: payload,
            }).unwrap();
            showToast(t('branch.branchCreateSuccess'), 'success');
          }
        }

        onCloseDrawer();
      } catch (error) {
        showToast((error as Error).data?.message ?? t('branch.branchSaveError'), 'error');
      }
    },
  });

  const onSubmit = handleSubmit();
  const isSaving = isSubmitting || (isOwner ? isCreatingOwner || isUpdatingOwner : isCreatingAdmin || isUpdatingAdmin);

  const handleDelete = async () => {
    if (!values.id) return;

    try {
      if (isOwner) {
        await deleteOwnerBranch(values.id).unwrap();
      } else {
        await deleteAdminBranch({ companyId: companyId as string, branchId: values.id }).unwrap();
      }

      showToast(t('branch.branchDeleteSuccess'), 'success');
      setShowDeleteModal(false);
      onCloseDrawer();
    } catch (error) {
      showToast((error as Error).data?.message ?? t('branch.branchDeleteError'), 'error');
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            label={t('branch.branchName')}
            {...register('name')}
            error={errors.name && t(errors.name)}
            wrapperClassName="mb-0 md:col-span-2"
          />

          <div className="mb-0 md:col-span-2">
            <PhoneNumberRoInput
              label={t('phoneNumber')}
              value={values.phoneNumber}
              onChange={(val) => setFieldValue('phoneNumber', val)}
              error={errors.phoneNumber && t(errors.phoneNumber)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            label={t('country')}
            {...register('country')}
            error={errors.country && t(errors.country)}
            wrapperClassName="mb-0"
          />

          <CustomInput
            label={t('city')}
            {...register('city')}
            error={errors.city && t(errors.city)}
            wrapperClassName="mb-0"
          />

          <CustomInput
            label={t('street')}
            {...register('street')}
            error={errors.street && t(errors.street)}
            wrapperClassName="mb-0 md:col-span-2"
          />

          <CustomInput label={t('streetNumber')} {...register('streetNumber')} wrapperClassName="mb-0" />

          <CustomInput label={t('houseNumber')} {...register('houseNumber')} wrapperClassName="mb-0" />

          <CustomInput label={t('zipcode')} {...register('zipcode')} wrapperClassName="mb-0 md:col-span-2" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {isEdit && (
            <Button type="button" variant="danger" size="md" className="w-1/3" onClick={() => setShowDeleteModal(true)}>
              {t('delete')}
            </Button>
          )}
          <Button type="submit" variant="primary" size="md" className={isEdit ? 'w-2/3' : 'w-full'} loading={isSaving}>
            {t('submit')}
          </Button>
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
