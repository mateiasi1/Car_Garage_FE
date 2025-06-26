import Login from '../../components/login/Login';
import Layout from '../layout/Layout';

const LoginPage = () => {
  return (
    <Layout isPanelDisplayed={false} isHeaderDisplayed={false} isFooterDisplayed={false}>
      <Login />
    </Layout>
  );
};

export default LoginPage;
