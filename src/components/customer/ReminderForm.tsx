import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomInput } from '../shared/CustomInput';
import { CustomSelect } from '../shared/CustomSelect';
import { CustomTextarea } from '../shared/CustomTextarea';
import { Button } from '../shared/Button';
import { CustomerCar } from '../../models/CustomerCar';
import { AddCarReminderDTO } from '../../interfaces/customer-portal.payload';

interface ReminderFormProps {
  cars: CustomerCar[];
  selectedCarId?: string;
  onSubmit: (data: AddCarReminderDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const reminderDaysOptions = [
  { value: '1', label: '1 zi inainte' },
  { value: '3', label: '3 zile inainte' },
  { value: '7', label: '7 zile inainte' },
  { value: '14', label: '14 zile inainte' },
  { value: '30', label: '30 zile inainte' },
];

const ReminderForm: FC<ReminderFormProps> = ({
  cars,
  selectedCarId,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  const [carId, setCarId] = useState(selectedCarId || cars[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [reminderDaysBefore, setReminderDaysBefore] = useState('7');
  const [notifyViaSms, setNotifyViaSms] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!carId) {
      newErrors.carId = t('validation.required');
    }

    if (!title.trim()) {
      newErrors.title = t('validation.required');
    }

    if (!expiresAt) {
      newErrors.expiresAt = t('validation.required');
    }

    if (description.length > 1000) {
      newErrors.description = t('validation.maxLength', { max: 1000 });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const data: AddCarReminderDTO = {
      carId,
      title: title.trim(),
      description: description.trim() || undefined,
      expiresAt,
      reminderDaysBefore: parseInt(reminderDaysBefore, 10),
      notifyViaSms,
    };

    onSubmit(data);
  };

  const carOptions = cars.map((car) => ({
    value: car.id,
    label: `${car.licensePlate} - ${car.make || ''} ${car.model || ''}`.trim(),
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {cars.length > 1 && (
        <CustomSelect
          label={t('customer.reminders.selectCar')}
          value={carId}
          onChange={setCarId}
          options={carOptions}
          error={errors.carId}
        />
      )}

      <CustomInput
        label={t('customer.reminders.reminderTitle')}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setErrors((prev) => ({ ...prev, title: '' }));
        }}
        error={errors.title}
        placeholder={t('customer.reminders.titlePlaceholder')}
        isRequired
      />

      <CustomTextarea
        label={t('customer.reminders.description')}
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setErrors((prev) => ({ ...prev, description: '' }));
        }}
        maxLength={1000}
        rows={3}
        error={errors.description}
        placeholder={t('customer.reminders.descriptionPlaceholder')}
      />

      <CustomInput
        label={t('customer.reminders.expiresAt')}
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

      <CustomSelect
        label={t('customer.reminders.remindBefore')}
        value={reminderDaysBefore}
        onChange={setReminderDaysBefore}
        options={reminderDaysOptions}
      />

      <div className="flex items-center gap-3 py-2">
        <input
          type="checkbox"
          id="notifyViaSms"
          checked={notifyViaSms}
          onChange={(e) => setNotifyViaSms(e.target.checked)}
          className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
        />
        <label htmlFor="notifyViaSms" className="text-sm font-body text-text">
          {t('customer.reminders.notifyViaSms')}
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} fullWidth disabled={isLoading}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="primary" fullWidth loading={isLoading}>
          {t('customer.reminders.add')}
        </Button>
      </div>
    </form>
  );
};

export default ReminderForm;
