import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import 'react-datepicker/dist/react-datepicker.css';
import { useCreateCustomerMutation } from '../../rtk/services/customer-service';
import { Bounce, toast } from 'react-toastify';

const AddNewCustomer = () => {
  const { t } = useTranslation();
  // const { data, error, isLoading } = useFetchUserQuery(userId);
  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();
  const showToast = (message: string, type: 'error' | 'success') => {
    toast[type](message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
};
  const [licensePlate, setLicensePlate] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [category, setCategory] = useState('');
  const [inspectedBy, setInspectedBy] = useState(null);
  const [inspectionDate, setInspectionDate] = useState(null);
  const [inspectionType, setInspectionType] = useState('');

  const handleLicensePlateChange = (event) => {
    setLicensePlate(event.target.value);
  };

  const handlePhoneNumbereChange = (event) => {
    setPhoneNumber(event.target.value);
  };
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleInspecredByChange = (event) => {
    setInspectedBy(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleInspectionTypeChange = (event) => {
    setInspectionType(event.target.value);
  };

  const onAddButtonClick = async () => {
    var newCustomer = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      licensePlate: licensePlate,
      category: category,
      inspectedBy: inspectedBy,
      inspectionDate: inspectionDate,
      inspectionType: inspectionType
    }
    try {
      await createCustomer(newCustomer).unwrap();
      alert("User created successfully!");
      showToast(t('customerAdded'), 'success');
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
        showToast(`${t('errorOccurred')} ${error.message}`, 'error');
      } else {
        showToast(`${t('unknownError')}`, 'error');
      }
    }
  }

   return (
    <div>
      <div className="h-full flex flex-col items-center my-20">
        <h1>{t('addNewCustomer')}</h1>
      </div>
      <div className="flex flex-col container mx-auto px-4">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="mb-4">
        <label htmlFor="licensePlate" className="block text-gray-700 text-sm font-bold mb-2">{t('licensePlate')}</label>
        <input onChange={handleLicensePlateChange} type="text" id="licensePlate" name="licensePlate" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">{t('phoneNumber')}</label>
        <input onChange={handlePhoneNumbereChange} type="text" id="phoneNumber" name="phoneNumber" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div className="mb-4">
        <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">{t('firstName')}</label>
        <input onChange={handleFirstNameChange} type="text" id="firstName" name="firstName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div className="mb-4">
        <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">{t('lastName')}</label>
        <input onChange={handleLastNameChange} type="text" id="lastName" name="lastName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div className="mb-4">
        <label htmlFor="selectCategory" className="block text-gray-700 text-sm font-bold mb-2">{t('selectCategory')}</label>
        <select
          id="selectCategory"
          name="selectCategory"
          value={category}
          onChange={handleCategoryChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">{t('selectCategory')}</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="inspectedBy" className="block text-gray-700 text-sm font-bold mb-2">{t('inspectedBy')}</label>
        <input onChange={handleInspecredByChange} type="text" id="inspectedBy" name="inspectedBy" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div className="mb-4">
        <label htmlFor="inspectionDate" className="block text-gray-700 text-sm font-bold mb-2">{t('inspectionDate')}</label>
        <DatePicker
          id="inspectionDate"
          name="inspectionDate"
          selected={inspectionDate}
          onChange={date => setInspectionDate(date)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="inspectionType" className="block text-gray-700 text-sm font-bold mb-2">{t('inspectionType')}</label>
        <select
          id="inspectionType"
          name="inspectionType"
          value={inspectionType}
          onChange={handleInspectionTypeChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">{t('selectInspectionType')}</option>
          <option value="yearlyType">{t('yearlyType')}</option>
          <option value="transportType">{t('transportType')}</option>
          <option value="lessThan10Years">{t('lessThan10Years')}</option>
          {/* Add more options as needed */}
        </select>
      </div>
    </div>
  </div>
  <div className="flex justify-end mt-4">
    <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={onAddButtonClick}
    >
        { t('Add') }
    </button>
</div>
</div>
    </div>
  );
};

export default AddNewCustomer;
