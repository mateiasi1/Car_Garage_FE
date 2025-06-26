import Reports from '../../components/reports/reports';
import Layout from '../layout/Layout';
import Report from '../../models/Report';

const ReportsPage = () => {
  const reports: Report[] = [
    {
      id: 1,
      dataType1: 'Report on Sales Growth',
      inspectionDate: 'January 18, 2025',
      status: 'Completed',
      dataType2: 'An in-depth analysis of sales performance in Q4 2024.',
    },
    {
      id: 2,
      dataType1: 'Customer Satisfaction Report',
      inspectionDate: 'January 15, 2025',
      status: 'In Progress',
      dataType2: 'Survey results and customer feedback analysis for 2024.',
    },
    {
      id: 3,
      dataType1: 'Financial Overview 2024',
      inspectionDate: 'January 10, 2025',
      status: 'Completed',
      dataType2: 'A comprehensive report on the financial performance for the year 2024.',
    },
    {
      id: 4,
      dataType1: 'Marketing Campaign Effectiveness',
      inspectionDate: 'January 5, 2025',
      status: 'Pending',
      dataType2: 'Evaluation of marketing campaigns and their impact on sales.',
    },
  ];

  return (
    <Layout>
      <Reports report={reports} />
    </Layout>
  );
};

export default ReportsPage;
