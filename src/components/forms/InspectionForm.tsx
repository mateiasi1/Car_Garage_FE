import { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../constants/routes';
import { AuthContext } from '../../contexts/authContext';
import { useAppSelector } from '../../hooks/reduxHooks';
import { useCreateInspectionMutation, useUpdateInspectionMutation } from '../../rtk/services/inspections-service';
import { useFetchLicensePlatePatternsQuery } from '../../rtk/services/licensePlatePattern-service';
import { CarCategories } from '../../utils/enums/CarCategories';
import { InspectionType } from '../../utils/enums/InspectionTypes';
import { formatInspectionDate } from '../../utils/formatInspectionDate';
import { showToast } from '../../utils/showToast';
import { PageContainer } from '../shared/PageContainer';
import { CustomInput } from '../shared/CustomInput';
import { CustomSelect } from '../shared/CustomSelect';
import { Button } from '../shared/Button';
import { PhoneNumberRoInput } from '../PhoneNumberRoInput';

type FormData = {
  licensePlate: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  carCategory: CarCategories;
  inspectionType: InspectionType;
  inspectedAt: string;
  branchId: string;
};

const InspectionForm: FC = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { data: patterns = [] } = useFetchLicensePlatePatternsQuery();
  const navigate = useNavigate();
  const [createInspection] = useCreateInspectionMutation();
  const [updateInspection] = useUpdateInspectionMutation();
  const selectedInspection = useAppSelector((state) => state.inspection.selectedInspection);

  const isDeleted = selectedInspection?.deletedAt !== null && selectedInspection?.deletedAt !== undefined;

  const [form, setForm] = useState<FormData>({
    licensePlate: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    carCategory: CarCategories.B,
    inspectionType: InspectionType.twoYears,
    inspectedAt: new Date().toISOString().split('T')[0],
    branchId: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    if (selectedInspection) {
      setForm({
        licensePlate: selectedInspection.car.licensePlate,
        phoneNumber: selectedInspection.car.customer.phoneNumber,
        firstName: selectedInspection.car.customer.firstName,
        lastName: selectedInspection.car.customer.lastName,
        carCategory: selectedInspection.car.category,
        inspectionType: selectedInspection.type,
        inspectedAt: selectedInspection.inspectedAt.split('T')[0],
        branchId: selectedInspection.branchId,
      });
    }
  }, [selectedInspection]);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.licensePlate) {
      newErrors.licensePlate = 'fieldRequired';
    } else if (!patterns.some((pattern) => new RegExp(pattern.regexPattern).test(form.licensePlate))) {
      newErrors.licensePlate = 'fieldInvalid';
    }

    if (!form.phoneNumber) newErrors.phoneNumber = 'fieldRequired';
    if (!form.firstName) newErrors.firstName = 'fieldRequired';
    if (!form.lastName) newErrors.lastName = 'fieldRequired';
    if (!form.carCategory) newErrors.carCategory = 'fieldRequired';
    if (!form.inspectionType) newErrors.inspectionType = 'fieldRequired';
    if (!form.inspectedAt) newErrors.inspectedAt = 'fieldRequired';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        licensePlate: form.licensePlate,
        phoneNumber: form.phoneNumber,
        firstName: form.firstName,
        lastName: form.lastName,
        carCategory: form.carCategory,
        inspectedBy: user?.id,
        inspectionType: form.inspectionType,
        inspectedAt: formatInspectionDate(form.inspectedAt),
        branchId: form.branchId,
      };

      if (selectedInspection?.id) {
        await updateInspection({ id: selectedInspection.id, ...payload }).unwrap();
      } else {
        await createInspection(payload).unwrap();
      }

      showToast(t('inspectionCreated'), 'success');
      navigate(routes.INSPECTIONS);
    } catch {
      showToast(t('internalError'), 'error');
    }
  };

  return (
    <PageContainer className="items-start justify-center">
      <div className="flex flex-col h-[calc(100vh-12rem)] w-full max-w-6xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="
            w-full h-full bg-card rounded-3xl shadow-2xl border border-card/40
            flex flex-col overflow-hidden
          "
        >
          {/* Header */}
          <div className="px-4 sm:px-6 pt-4 pb-2 border-b border-card/40">
            <h1 className="text-xl sm:text-2xl font-heading font-semibold text-primary text-center sm:text-left">
              {t('addNewInspection')}
            </h1>
          </div>

          {/* Content (scrollable) */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-6 bg-background/40">
            {/* Car info */}
            <div className="bg-card rounded-2xl p-4 sm:p-5 border border-card/40">
              <h3 className="text-lg font-heading font-semibold text-text mb-4">{t('carInformation')}</h3>

              <div className="space-y-4">
                <CustomInput
                  label={t('licensePlate')}
                  value={form.licensePlate}
                  onChange={(e) => updateField('licensePlate', e.target.value.toUpperCase())}
                  placeholder="DJ-51-ABC"
                  autoComplete="off"
                  error={errors.licensePlate && t(errors.licensePlate)}
                />

                <CustomSelect
                  label={t('carCategory')}
                  value={form.carCategory}
                  onChange={(val) => updateField('carCategory', val)}
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

            {/* Customer info */}
            <div className="bg-card rounded-2xl p-4 sm:p-5 border border-card/40">
              <h3 className="text-lg font-heading font-semibold text-text mb-4">{t('customerInformation')}</h3>

              <div className="space-y-4">
                <CustomInput
                  label={t('firstName')}
                  value={form.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder={t('firstName')} // ex. "Ion"
                  error={errors.firstName && t(errors.firstName)}
                />

                <CustomInput
                  label={t('lastName')}
                  value={form.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder={t('lastName')}
                  error={errors.lastName && t(errors.lastName)}
                />

                <PhoneNumberRoInput
                  label={t('phoneNumber')}
                  value={form.phoneNumber}
                  onChange={(val) => updateField('phoneNumber', val)}
                  placeholder="712345678"
                  error={errors.phoneNumber && t(errors.phoneNumber)}
                />
              </div>
            </div>

            {/* Inspection info */}
            <div className="bg-card rounded-2xl p-4 sm:p-5 border border-card/40">
              <h3 className="text-lg font-heading font-semibold text-text mb-4">{t('inspectionInformation')}</h3>

              <div className="space-y-4">
                <CustomSelect
                  label={t('inspectionDuration')}
                  value={form.inspectionType}
                  onChange={(val) => updateField('inspectionType', val)}
                  options={[
                    { value: InspectionType.halfYear, label: t('halfYear') },
                    { value: InspectionType.oneYear, label: t('yearly') },
                    { value: InspectionType.twoYears, label: t('twoYears') },
                  ]}
                  error={errors.inspectionType && t(errors.inspectionType)}
                />

                <CustomInput
                  label={t('inspectionDate')}
                  type="date"
                  value={form.inspectedAt}
                  onChange={(e) => updateField('inspectedAt', e.target.value)}
                  onClick={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.showPicker) target.showPicker();
                  }}
                  placeholder={t('inspectionDatePlaceholder')} // ex. "Selectează data"
                  error={errors.inspectedAt && t(errors.inspectedAt)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4 border-t border-card/40 bg-card">
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
              >
                {t('submit')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default InspectionForm;
