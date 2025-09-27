import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { FC } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { Report } from '../../models/Report';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ReportsProps = {
  reports: Report[];
};

const Reports: FC<ReportsProps> = ({ reports }) => {
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
  };

  return (
    <div className="flex flex-col min-h-screen w-full p-4 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {reports.map((report, idx) => (
          <div key={idx} className="bg-white shadow-sm rounded-lg p-4 flex flex-col">
            <div className="flex items-center space-x-2">
              <svg
                className="h-6 w-6 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2v20m10-10H2" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900">{report.dataType1}</h3>
            </div>
            <p className="text-sm text-gray-600">{report.inspectionDate}</p>
            <p className="mt-2 text-gray-700">{report.dataType2}</p>

            {/* Bar Chart */}
            <div className="mt-4 min-h-[200px]">
              <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>

            {/* Status Badge */}
            <span
              className={`mt-4 inline-block px-3 py-1 text-sm font-medium rounded-full 
              ${
                report.status === 'Completed'
                  ? 'bg-green-100 text-green-800'
                  : report.status === 'In Progress'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {report.status}
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
        ))}
      </div>
    </div>
  );
};

export default Reports;
