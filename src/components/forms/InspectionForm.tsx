import { FC, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { routes } from '../../constants/routes';
import { AuthContext } from '../../contexts/authContext';
import { useAppSelector } from '../../hooks/reduxHooks';
import { useForm } from '../../hooks/useForm';
import { useCreateInspectionMutation, useUpdateInspectionMutation } from '../../rtk/services/inspections-service';
import { useFetchLicensePlatePatternsQuery } from '../../rtk/services/licensePlatePattern-service';
import { userApi } from '../../rtk/services/user-service';
import { CarCategories } from '../../utils/enums/CarCategories';
import { InspectionType } from '../../utils/enums/InspectionTypes';
import { formatInspectionDate } from '../../utils/formatInspectionDate';
import { showToast } from '../../utils/showToast';
import { CustomInput } from '../shared/CustomInput';
import { CustomSelect } from '../shared/CustomSelect';
import { CustomDatePicker } from '../shared/CustomDatePicker';
import { Button } from '../shared/Button';
import { IconButton } from '../shared/IconButton';
import { PhoneNumberRoInput } from '../PhoneNumberRoInput';

type FormData = {
  licensePlate: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  carCategory: CarCategories;
  inspectionType: InspectionType;
  inspectedAt: Date | null;
  branchId: string;
};

const InspectionForm: FC = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { data: patterns = [] } = useFetchLicensePlatePatternsQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createInspection] = useCreateInspectionMutation();
  const [updateInspection] = useUpdateInspectionMutation();
  const selectedInspection = useAppSelector((state) => state.inspection.selectedInspection);

  const isEdit = Boolean(selectedInspection?.id);
  const isDeleted = selectedInspection?.deletedAt !== null && selectedInspection?.deletedAt !== undefined;

  // Form setup using useForm hook
  const { values, errors, register, handleSubmit, setFieldValue, setValues, isSubmitting } = useForm<FormData>({
    initialValues: {
      licensePlate: '',
      phoneNumber: '',
      firstName: '',
      lastName: '',
      carCategory: CarCategories.B,
      inspectionType: InspectionType.twoYears,
      inspectedAt: new Date(),
      branchId: '',
    },

    // Validation configuration for each field
    fields: {
      licensePlate: {
        required: true,
        validate: (value) => {
          // Check if license plate is valid according to patterns
          const isValid = patterns.some((pattern) => new RegExp(pattern.regexPattern).test(String(value)));
          return isValid ? null : 'fieldInvalid';
        },
      },
      phoneNumber: {
        validate: (value) => {
          const val = String(value ?? '').trim();
          if (!val) return 'phoneNumberEmpty';
          // Check if phone number has at least 9 digits after +40
          if (val.startsWith('+40') && val.length < 12) return 'phoneNumberEmpty';
          // Check if phone number starts with 7 after +40 (Romanian numbers)
          if (val.startsWith('+40') && !val.startsWith('+407')) return 'fieldInvalid';
          return null;
        },
      },
      firstName: { required: true },
      lastName: { required: true },
      carCategory: { required: true },
      inspectionType: { required: true },
      inspectedAt: { required: true },
    },

    // Called on submit after validation passes
    onSubmit: async (formValues) => {
      try {
        const payload = {
          licensePlate: formValues.licensePlate,
          phoneNumber: formValues.phoneNumber,
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          carCategory: formValues.carCategory,
          inspectedBy: user?.id,
          inspectionType: formValues.inspectionType,
          inspectedAt: formValues.inspectedAt
            ? formatInspectionDate(formValues.inspectedAt.toISOString().split('T')[0])
            : '',
          branchId: formValues.branchId,
          ...(selectedInspection?.car?.customer?.id && { customerId: selectedInspection.car.customer.id }),
          ...(selectedInspection?.car?.id && { carId: selectedInspection.car.id }),
        };

        if (selectedInspection?.id) {
          await updateInspection({ id: selectedInspection.id, ...payload }).unwrap();
        } else {
          await createInspection(payload).unwrap();
          // Refresh user profile to update demo limits
          dispatch(userApi.util.invalidateTags(['User']));
        }

        showToast(t('inspectionCreated'), 'success');
        navigate(routes.INSPECTIONS);
      } catch {
        showToast(t('internalError'), 'error');
      }
    },
  });

  // Populate form when editing an existing inspection
  useEffect(() => {
    if (selectedInspection) {
      setValues({
        licensePlate: selectedInspection.car.licensePlate,
        phoneNumber: selectedInspection.car.customer.phoneNumber,
        firstName: selectedInspection.car.customer.firstName,
        lastName: selectedInspection.car.customer.lastName,
        carCategory: selectedInspection.car.category,
        inspectionType: selectedInspection.type,
        inspectedAt: new Date(selectedInspection.inspectedAt),
        branchId: selectedInspection.branchId,
      });
    }
  }, [selectedInspection, setValues]);

  return (
    <div className="p-6 pt-10 w-full">
      <div className="flex flex-col h-[calc(100vh-14rem)] w-full max-w-6xl mx-auto">
        <form
          onSubmit={handleSubmit()}
          className="
            w-full h-full bg-surface rounded-xl border border-border
            flex flex-col overflow-hidden
          "
        >
          {/* Header */}
          <div className="px-4 sm:px-6 pt-4 pb-2 border-b border-border">
            <div className="flex items-center gap-3">
              <IconButton
                type="button"
                variant="ghost"
                size="md"
                onClick={() => navigate(routes.INSPECTIONS)}
                aria-label={t('back')}
                className="text-text/70 hover:text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
              </IconButton>
              <h1 className="text-xl sm:text-2xl font-heading font-semibold text-primary">
                {isEdit ? t('editInspection') : t('addNewInspection')}
              </h1>
            </div>
          </div>

          {/* Content (scrollable) */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-6">
            {/* Car Info */}
            <div className="bg-background rounded-lg p-4 sm:p-5 border border-border">
              <h3 className="text-lg font-heading font-semibold text-text mb-4">{t('carInformation')}</h3>

              <div className="space-y-4">
                {/* License Plate - uses register() for standard input */}
                <CustomInput
                  label={`${t('licensePlate')} *`}
                  {...register('licensePlate')}
                  onChange={(e) => setFieldValue('licensePlate', e.target.value.toUpperCase())}
                  placeholder="DJ-51-ABC"
                  autoComplete="off"
                  error={errors.licensePlate && t(errors.licensePlate)}
                />

                {/* Car Category - uses setFieldValue for custom select */}
                <CustomSelect
                  label={`${t('carCategory')} *`}
                  value={values.carCategory}
                  onChange={(val) => setFieldValue('carCategory', val as CarCategories)}
                  options={[CarCategories.A, CarCategories.B, CarCategories.C, CarCategories.D, CarCategories.E].map(
                    (cat) => ({
                      value: cat,
                      label: cat,
                    })
                  )}
                  error={errors.carCategory && t(errors.carCategory)}
                />
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-background rounded-lg p-4 sm:p-5 border border-border">
              <h3 className="text-lg font-heading font-semibold text-text mb-4">{t('customerInformation')}</h3>

              <div className="space-y-4">
                <CustomInput
                  label={`${t('firstName')} *`}
                  {...register('firstName')}
                  placeholder={t('firstName')}
                  error={errors.firstName && t(errors.firstName)}
                />

                <CustomInput
                  label={`${t('lastName')} *`}
                  {...register('lastName')}
                  placeholder={t('lastName')}
                  error={errors.lastName && t(errors.lastName)}
                />

                {/* Phone - uses setFieldValue for custom component */}
                <PhoneNumberRoInput
                  label={`${t('phoneNumber')} *`}
                  value={values.phoneNumber}
                  onChange={(val) => setFieldValue('phoneNumber', val)}
                  placeholder="712345678"
                  error={errors.phoneNumber ? t(errors.phoneNumber) : undefined}
                />
              </div>
            </div>

            {/* Inspection Info */}
            <div className="bg-background rounded-lg p-4 sm:p-5 border border-border">
              <h3 className="text-lg font-heading font-semibold text-text mb-4">{t('inspectionInformation')}</h3>

              <div className="space-y-4">
                <CustomSelect
                  label={`${t('inspectionDuration')} *`}
                  value={values.inspectionType}
                  onChange={(val) => setFieldValue('inspectionType', val as InspectionType)}
                  options={[
                    { value: InspectionType.halfYear, label: t('halfYear') },
                    { value: InspectionType.oneYear, label: t('yearly') },
                    { value: InspectionType.twoYears, label: t('twoYears') },
                  ]}
                  error={errors.inspectionType && t(errors.inspectionType)}
                />

                <CustomDatePicker
                  label={`${t('inspectionDate')} *`}
                  selected={values.inspectedAt}
                  onChange={(date) => setFieldValue('inspectedAt', date)}
                  maxDate={new Date()}
                  placeholder={t('inspectionDatePlaceholder')}
                  error={errors.inspectedAt && t(errors.inspectedAt)}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-4 border-t border-border bg-surface">
            {isDeleted && (
              <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  ⚠️ {t('inspectionDeleted.viewOnly', { licensePlate: selectedInspection?.car?.licensePlate })}
                </p>
              </div>
            )}
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                fullWidth={false}
                className="w-full md:w-auto"
                disabled={isDeleted}
                loading={isSubmitting}
              >
                {t('submit')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InspectionForm;
