import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

type FormData = {
  licensePlate: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  carCategory: 'A' | 'B' | 'C' | 'D' | 'E';
  inspectionType: 'HALF_YEAR' | 'ONE_YEAR' | 'TWO_YEARS';
  inspectedAt: string;
};

const InspectionForm: FC = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormData>({
    licensePlate: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    carCategory: 'B',
    inspectionType: 'TWO_YEARS',
    inspectedAt: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle submit logic
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-background px-4">
      <div className="w-full max-w-5xl bg-card p-8 rounded-md shadow-md">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <section>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">{t('carInformation')}</h3>

              <div className="mb-4">
                <label htmlFor="licensePlate" className="block font-semibold mb-1">
                  {t('licensePlate')}
                </label>
                <input
                  type="text"
                  name="licensePlate"
                  id="licensePlate"
                  value={form.licensePlate}
                  onChange={handleChange}
                  placeholder="DJ-51-ABC"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  pattern="[A-Z]{2}-\d{2}-[A-Z]{3}"
                  title="Format: DJ-51-ABC"
                />
              </div>

              <div>
                <label htmlFor="carCategory" className="block font-semibold mb-1">
                  {t('carCategory')}
                </label>
                <select
                  name="carCategory"
                  id="carCategory"
                  value={form.carCategory}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  {['A', 'B', 'C', 'D', 'E'].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">{t('customerInformation')}</h3>

              <div className="mb-4">
                <label htmlFor="firstName" className="block font-semibold mb-1">
                  {t('firstName')}
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="lastName" className="block font-semibold mb-1">
                  {t('lastName')}
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block font-semibold mb-1">
                  {t('phoneNumber')}
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="+40712345678"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  pattern="\+?\d{7,15}"
                  title="Phone number, e.g. +40712345678"
                />
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">{t('inspectionInformation')}</h3>

              <div className="mb-4">
                <label htmlFor="inspectionType" className="block font-semibold mb-1">
                  {t('inspectionDuration')}
                </label>
                <select
                  name="inspectionType"
                  id="inspectionType"
                  value={form.inspectionType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="HALF_YEAR">{t('halfYear')}</option>
                  <option value="ONE_YEAR">{t('yearly')}</option>
                  <option value="TWO_YEARS">{t('twoYears')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="inspectedAt" className="block font-semibold mb-1">
                  {t('inspectionDate')}
                </label>
                <input
                  type="date"
                  name="inspectedAt"
                  id="inspectedAt"
                  value={form.inspectedAt}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
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
