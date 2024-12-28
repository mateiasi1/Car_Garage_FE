import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { downloadPDF } from '../../shared/downloadTableAsPDF';
import downloadCSV from '../../shared/downloadTableAsCSV';

const Monthly: FC = () => {
    const { t } = useTranslation();

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

    const inspections = [
        { id: 1, car: 'Toyota Camry', firstName: 'John', lastName: 'Doe', licensePlate: 'ABC123', category: 'Sedan', inspectionType: 'Routine', phoneNumber: '123-456-7890' },
        { id: 2, car: 'Honda Accord', firstName: 'Jane', lastName: 'Smith', licensePlate: 'XYZ789', category: 'Sedan', inspectionType: 'Annual', phoneNumber: '098-765-4321' },
        // Add more inspections as needed
    ];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => showToast(t('textCopiedToClipboard'), 'success'))
            .catch(err => showToast(err.message, 'error'));
    };

    const handleDownloadCSV = () => {
        downloadCSV(data, 'inspections.csv');
    };

    const handleDownloadPDF = () => {
        downloadPDF('table', 'inspections.pdf');
    };

    return (
        <div className="flex flex-col items-center h-screen p-4">
            <h1 className="text-3xl font-semibold mb-8">{t('smsSentThisMonth')}</h1>
            <div className="flex mb-4">
                <button
                    onClick={handleDownloadCSV}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    {t('DownloadCSV')}
                </button>
                <button
                    onClick={handleDownloadPDF}
                    className="ml-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                    {t('DownloadPDF')}
                </button>
            </div>
            <div className="overflow-x-auto w-full max-w-4xl" id="table">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Car</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">First Name</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Last Name</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">License Plate</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Category</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Inspection Type</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inspections.map((inspection, index) => (
                            <tr key={inspection.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-900">{inspection.car}</td>
                                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-900">{inspection.firstName}</td>
                                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-900">{inspection.lastName}</td>
                                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-900">{inspection.licensePlate}</td>
                                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-900">{inspection.category}</td>
                                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-900">{inspection.inspectionType}</td>
                                <td
                                    className="py-3 px-4 border-b border-gray-200 text-sm text-gray-900 text-blue-500 cursor-pointer hover:underline"
                                    onClick={() => copyToClipboard(inspection.phoneNumber)}
                                >
                                    {inspection.phoneNumber}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Monthly;
