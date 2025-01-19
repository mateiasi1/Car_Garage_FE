import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import 'react-datepicker/dist/react-datepicker.css';
import { useCreateCustomerMutation } from '../../rtk/services/customer-service';
import { Bounce, toast } from 'react-toastify';
import { useCreateUserMutation } from '../../rtk/services/user-service';

const AddNewUser = () => {
  const { t } = useTranslation();
  // const { data, error, isLoading } = useFetchUserQuery(userId);
  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;
  const [createUser, { isLoading }] = useCreateUserMutation();
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
  const [company, setCompany] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
 const [password, setPassword] = useState<string>('');
 const [email, setEmail] = useState<string>('');
 
 const [roleOptions, setRoleOptions] = useState(['Admin', 'Inspector'])
 const [role, setRole] = useState(roleOptions[0]);

;
 
  const handleCompanyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompany(event.target.value);
  };

  const handlePhoneNumbereChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
  };
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  
  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleSetPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleSetRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value);
  };

  const onAddButtonClick = async () => {
    var newUser = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      company: company,
      password: password
    }
    try {
      await createUser(newUser).unwrap();
      alert("User created successfully!");
      showToast(t('UserAdded'), 'success');
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
        <h1>{t('addNewUser')}</h1>
      </div>
      <div className="flex flex-col container mx-auto px-4">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="mb-4">
        <label htmlFor="company" className="block text-gray-700 text-sm font-bold mb-2">{t('company')}</label>
        <input onChange={handleCompanyChange} type="text" id="company" name="company" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
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
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">{t('emailTitle')}</label>
        <input onChange={handleEmailChange} type="text" id="email" name="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">{t('passwordTitle')}</label>
        <input onChange={handleSetPassword} type="text" id="password" name="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div className="mb-4">
        <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
          {t('roleTitle')}
        </label>
        <select
          id="role"
          name="role"
          value={role}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          disabled
        >
          {roleOptions.map((roleOption, index) => (
            <option key={index} value={roleOption}>
              {roleOption}
            </option>
          ))}
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

export default AddNewUser;
