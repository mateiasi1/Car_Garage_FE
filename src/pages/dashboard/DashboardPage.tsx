import { FC } from 'react';
import Dashboard from '../../components/dashboard/Dashboard';
import Layout from '../layout/Layout';

const DashboardPage: FC = () => {
  return (
    <Layout isPanelDisplayed={true} isHeaderDisplayed={false} isFooterDisplayed={false}>
      <Dashboard />
    </Layout>
  );
};

export default DashboardPage;
