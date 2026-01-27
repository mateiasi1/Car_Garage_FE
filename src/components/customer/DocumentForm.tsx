import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomInput } from '../shared/CustomInput';
import { CustomSelect } from '../shared/CustomSelect';
import { Button } from '../shared/Button';
import { DocumentType } from '../../models/CustomerCar';
import { AddCarDocumentDTO } from '../../interfaces/customer-portal.payload';

interface DocumentFormProps {
  carId: string;
  onSubmit: (data: AddCarDocumentDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const documentTypes: { value: DocumentType; labelKey: string }[] = [
  { value: 'ITP', labelKey: 'customer.documents.itp' },
  { value: 'RCA', labelKey: 'customer.documents.rca' },
  { value: 'VIGNETTE', labelKey: 'customer.documents.vignette' },
  { value: 'MECHANICAL', labelKey: 'customer.documents.mechanical' },
  { value: 'CUSTOM', labelKey: 'customer.documents.custom' },
];

const DocumentForm: FC<DocumentFormProps> = ({ carId, onSubmit, onCancel, isLoading = false }) => {
  const { t } = useTranslation();

  const [type, setType] = useState<DocumentType>('ITP');
  const [title, setTitle] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!expiresAt) {
      newErrors.expiresAt = t('validation.required');
    }

    if (type === 'CUSTOM' && !title.trim()) {
      newErrors.title = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const data: AddCarDocumentDTO = {
      carId,
      type,
      expiresAt,
      ...(type === 'CUSTOM' && { title: title.trim() }),
    };

    onSubmit(data);
  };

  const typeOptions = documentTypes.map((dt) => ({
    value: dt.value,
    label: t(dt.labelKey),
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CustomSelect
        label={t('customer.documents.type')}
        value={type}
        onChange={(val) => setType(val as DocumentType)}
        options={typeOptions}
      />

      {type === 'CUSTOM' && (
        <CustomInput
          label={t('customer.documents.customTitle')}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setErrors((prev) => ({ ...prev, title: '' }));
          }}
          error={errors.title}
          placeholder={t('customer.documents.titlePlaceholder')}
          isRequired
        />
      )}

      <CustomInput
        label={t('customer.documents.expiresAt')}
        type="date"
        value={expiresAt}
        min={new Date().toISOString().split('T')[0]}
        onChange={(e) => {
          setExpiresAt(e.target.value);
          setErrors((prev) => ({ ...prev, expiresAt: '' }));
        }}
        error={errors.expiresAt}
        isRequired
      />

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} fullWidth disabled={isLoading}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="primary" fullWidth loading={isLoading}>
          {t('customer.documents.add')}
        </Button>
      </div>
    </form>
  );
};

export default DocumentForm;
