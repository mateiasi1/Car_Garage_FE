import { useTranslation } from "react-i18next";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


type Report = {
  id: number;
  dataType1: string;
  inspectionDate: string; 
  status: string;
  dataType2: string;
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Reports = ({ report }: { report: Report[] }) => {
    const { t } = useTranslation();

    const chartData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          {
            label: 'Sales Growth',
            data: [300, 400, 350, 500],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };
    const downloadPDF = () => {
        console.log('download');
    }
    
  return (
    <div className="flex flex-col items-center h-screen p-4">
            <h1 className="text-3xl font-semibold mb-8">{t('reports')}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
            <div className="bg-white shadow-md rounded-lg p-4 mb-4 border-l-4 border-blue-500">
      {/* Report Title */}
      <div className="flex items-center space-x-2">
        <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20m10-10H2" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900">{report[0].dataType1}</h3>
      </div>
      <p className="text-sm text-gray-600">{report[0].inspectionDate}</p>
      <p className="mt-2 text-gray-700">{report[0].dataType2}</p>

      {/* Bar Chart */}
      <div className="mt-4">
        <Bar data={chartData} options={{ responsive: true }} />
      </div>

      {/* Status Badge */}
      <span className={`mt-4 inline-block px-3 py-1 text-sm font-medium rounded-full 
        ${report[0].status === 'Completed' ? 'bg-green-100 text-green-800' : 
            report[0].status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-gray-100 text-gray-800'}`}>
        {report[0].status}
      </span>

      {/* Download Button */}
      <div className="mt-4">
        <button 
          onClick={downloadPDF} 
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {t('downloadPDF')}
        </button>
      </div>
    </div>
      </div>
    </div>
  );
};

export default Reports;
