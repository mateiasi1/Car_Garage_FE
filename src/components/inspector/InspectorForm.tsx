import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateInspectorDTO, UpdateInspectorDTO } from '../../interfaces/inspector.payload';
import {
  useCreateInspectorMutation,
  useUpdateInspectorMutation,
  useDeleteInspectorMutation,
} from '../../rtk/services/inspector-service';
import { showToast } from '../../utils/showToast';
import PasswordInput from '../shared/PasswordInput';
import { PrimaryButton } from '../shared/PrimaryButton';
import ConfirmationModal from '../shared/ConfirmationModal';
import { DangerButton } from '../shared/DangerButton';

interface InspectorFormProps {
  selectedInspector: Partial<InspectorFormState> | null;
  onCloseDrawer: () => void;
}

type InspectorFormState = {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  username: string;
  password?: string;
};

const initialState: InspectorFormState = {
  email: '',
  username: '',
  password: '',
  firstName: '',
  lastName: '',
};

const InspectorForm: FC<InspectorFormProps> = ({ selectedInspector, onCloseDrawer }) => {
  const { t } = useTranslation();
  const [createInspector, { isLoading: isCreating }] = useCreateInspectorMutation();
  const [updateInspector, { isLoading: isUpdating }] = useUpdateInspectorMutation();
  const [deleteInspector] = useDeleteInspectorMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isEdit = Boolean(selectedInspector);

  const [form, setForm] = useState<InspectorFormState>({
    ...initialState,
    ...(selectedInspector ?? {}),
  });

  useEffect(() => {
    if (selectedInspector) {
      setForm((prev) => ({
        ...prev,
        ...selectedInspector,
        password: '',
      }));
    } else {
      setForm({ ...initialState });
      setShowDeleteModal(false);
    }
  }, [selectedInspector]);

  const inputBaseClass =
    'w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-primary';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

    if (form.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        showToast(t('invalidEmail'), 'error');
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
        const { id, username, firstName, lastName } = form;
        const payload: UpdateInspectorDTO = { id, username, firstName, lastName, email: form.email || '' };
        await updateInspector(payload).unwrap();
        showToast(t('inspectorUpdateSuccess'), 'success');
      } else {
        const { username, firstName, lastName } = form;
        const payload: CreateInspectorDTO = {
          username,
          firstName,
          lastName,
          email: form.email || '',
          password: form.password || '',
        };
        await createInspector(payload).unwrap();
        showToast(t('inspectorCreateSuccess'), 'success');
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

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">{t('emailTitle')}</label>
            <input
              type="text"
              name="email"
              value={form.email || ''}
              onChange={handleChange}
              className={inputBaseClass}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">{t('username')}</label>
            <input
              type="text"
              name="username"
              value={form.username}
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
          {isEdit && <DangerButton type="button" text={t('delete')} onClick={() => setShowDeleteModal(true)} />}
          <PrimaryButton type="submit" text={t('submit')} disabled={isCreating || isUpdating} />
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
