import { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/authContext';
import { useAppSelector } from '../../hooks/reduxHooks';
import { useCreateInspectionMutation, useUpdateInspectionMutation } from '../../rtk/services/inspections-service';
import { useFetchLicensePlatePatternsQuery } from '../../rtk/services/licensePlatePattern-service';
import { CarCategories } from '../../utils/enums/CarCategories';
import { InspectionType } from '../../utils/enums/InspectionTypes';
import { formatInspectionDate } from '../../utils/formatInspectionDate';
import { showToast } from '../../utils/showToast';
import { useNavigate } from 'react-router-dom';

type FormData = {
  licensePlate: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  carCategory: CarCategories;
  inspectionType: InspectionType;
  inspectedAt: string;
  companyId: string;
};

const InspectionForm: FC = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { data: patterns = [] } = useFetchLicensePlatePatternsQuery();
  const navigate = useNavigate();
  const [createInspection] = useCreateInspectionMutation();
  const [updateInspection] = useUpdateInspectionMutation();
  const selectedInspection = useAppSelector((state) => state.inspection.selectedInspection);

  const [form, setForm] = useState<FormData>({
    licensePlate: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    carCategory: CarCategories.B,
    inspectionType: InspectionType.twoYears,
    inspectedAt: new Date().toISOString().split('T')[0],
    companyId: '',
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
        companyId: selectedInspection.companyId,
      });
    }
  }, [selectedInspection]);

  const clearError = (field: keyof FormData) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
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
    if (!form.companyId) newErrors.companyId = 'fieldRequired';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        companyId: form.companyId,
      };

      if (selectedInspection?.id) {
        // TODO: NEEDS INVESTIGATION, THERE MIGHT BE SOMETHING WRONG WITH BACK-END UPDATE
        await updateInspection({ id: selectedInspection.id, ...payload }).unwrap();
      } else {
        await createInspection(payload).unwrap();
      }

      showToast(t('inspectionCreated'), 'success');
      navigate('/inspections');
    } catch (err) {
      showToast(t('internalError'), 'error');
    }
  };

  const companyOptions =
    user?.companies.map((company) => ({
      label: company.name,
      value: company.id,
    })) || [];

  const inputBaseClass = 'w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2';
  const inputClass = (field: keyof FormData) =>
    `${inputBaseClass} ${errors[field] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`;

  return (
    <div className="min-h-screen flex justify-center items-center bg-background px-4">
      <div className="w-full max-w-5xl bg-card p-8 rounded-md shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">{t('carInformation')}</h3>

              <div className="mb-4 min-h-[4.5rem]">
                <label htmlFor="licensePlate" className="block font-semibold mb-1">
                  {t('licensePlate')}
                </label>
                <input
                  type="text"
                  name="licensePlate"
                  id="licensePlate"
                  value={form.licensePlate}
                  onChange={handleChange}
                  onFocus={() => clearError('licensePlate')}
                  placeholder="DJ-51-ABC"
                  className={inputClass('licensePlate')}
                />
                {errors.licensePlate && <p className="text-red-600 text-sm mt-1">{t(errors.licensePlate)}</p>}
              </div>

              <div className="mb-4 min-h-[4.5rem]">
                <label htmlFor="carCategory" className="block font-semibold mb-1">
                  {t('carCategory')}
                </label>
                <select
                  name="carCategory"
                  id="carCategory"
                  value={form.carCategory}
                  onChange={handleChange}
                  onFocus={() => clearError('carCategory')}
                  className={inputClass('carCategory')}
                >
                  {[CarCategories.A, CarCategories.B, CarCategories.C, CarCategories.D, CarCategories.E].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.carCategory && <p className="text-red-600 text-sm mt-1">{t(errors.carCategory)}</p>}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">{t('customerInformation')}</h3>

              {(['firstName', 'lastName', 'phoneNumber'] as const).map((field) => (
                <div key={field} className="mb-4 min-h-[4.5rem]">
                  <label htmlFor={field} className="block font-semibold mb-1">
                    {t(field)}
                  </label>
                  <input
                    type={field === 'phoneNumber' ? 'tel' : 'text'}
                    name={field}
                    id={field}
                    value={form[field]}
                    onChange={handleChange}
                    onFocus={() => clearError(field)}
                    className={inputClass(field)}
                    placeholder={field === 'phoneNumber' ? '+40712345678' : ''}
                  />
                  {errors[field] && <p className="text-red-600 text-sm mt-1">{t(errors[field])}</p>}
                </div>
              ))}
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">{t('inspectionInformation')}</h3>

              <div className="mb-4 min-h-[4.5rem]">
                <label htmlFor="inspectionType" className="block font-semibold mb-1">
                  {t('inspectionDuration')}
                </label>
                <select
                  name="inspectionType"
                  id="inspectionType"
                  value={form.inspectionType}
                  onChange={handleChange}
                  onFocus={() => clearError('inspectionType')}
                  className={inputClass('inspectionType')}
                >
                  <option value={InspectionType.halfYear}>{t('halfYear')}</option>
                  <option value={InspectionType.oneYear}>{t('yearly')}</option>
                  <option value={InspectionType.twoYears}>{t('twoYears')}</option>
                </select>
                {errors.inspectionType && <p className="text-red-600 text-sm mt-1">{t(errors.inspectionType)}</p>}
              </div>

              <div className="mb-4 min-h-[4.5rem]">
                <label htmlFor="inspectedAt" className="block font-semibold mb-1">
                  {t('inspectionDate')}
                </label>
                <input
                  type="date"
                  name="inspectedAt"
                  id="inspectedAt"
                  value={form.inspectedAt}
                  onChange={handleChange}
                  onFocus={() => clearError('inspectedAt')}
                  className={inputClass('inspectedAt')}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.inspectedAt && <p className="text-red-600 text-sm mt-1">{t(errors.inspectedAt)}</p>}
              </div>

              <div className="mb-4 min-h-[4.5rem]">
                <label htmlFor="companyId" className="block font-semibold mb-1">
                  {t('company')}
                </label>
                <select
                  name="companyId"
                  id="companyId"
                  value={form.companyId}
                  onChange={handleChange}
                  onFocus={() => clearError('companyId')}
                  className={inputClass('companyId')}
                >
                  <option value="" disabled hidden>
                    {t('selectCompany')}
                  </option>
                  {companyOptions.map((company) => (
                    <option key={company.value} value={company.value}>
                      {company.label}
                    </option>
                  ))}
                </select>
                {errors.companyId && <p className="text-red-600 text-sm mt-1">{t(errors.companyId)}</p>}
              </div>
            </section>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
          >
            {t('submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InspectionForm;
