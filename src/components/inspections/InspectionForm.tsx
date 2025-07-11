import { FC, useState } from 'react';

type FormData = {
  licensePlate: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  carCategory: 'A' | 'B' | 'C' | 'D' | 'E';
  inspectionType: 'HALF_YEAR' | 'ONE_YEAR' | 'TWO_YEARS';
  inspectedAt: string; // ISO date string
};

const InspectionForm: FC = () => {
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
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-background">
      <div className="w-full max-w-lg mx-auto bg-card p-6 rounded-md shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* License Plate */}
          <div>
            <label htmlFor="licensePlate" className="block font-semibold mb-1">
              License Plate
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

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block font-semibold mb-1">
              Phone Number
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

          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block font-semibold mb-1">
              First Name
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

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block font-semibold mb-1">
              Last Name
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

          {/* Car Category */}
          <div>
            <label htmlFor="carCategory" className="block font-semibold mb-1">
              Car Category
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

          {/* Inspection Type */}
          <div>
            <label htmlFor="inspectionType" className="block font-semibold mb-1">
              Inspection Type
            </label>
            <select
              name="inspectionType"
              id="inspectionType"
              value={form.inspectionType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="HALF_YEAR">Half Year</option>
              <option value="ONE_YEAR">One Year</option>
              <option value="TWO_YEARS">Two Years</option>
            </select>
          </div>

          {/* Inspected At */}
          <div>
            <label htmlFor="inspectedAt" className="block font-semibold mb-1">
              Inspection Date
            </label>
            <input
              type="date"
              name="inspectedAt"
              id="inspectedAt"
              value={form.inspectedAt}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
              max={new Date().toISOString().split('T')[0]} // Optional: restrict future dates if desired
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default InspectionForm;
