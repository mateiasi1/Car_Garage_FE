import Login from '../../components/login/Login';
import SEO from '../../components/shared/SEO';

const LoginPage = () => {
  return (
    <>
      <SEO
        title="Login - RoadReady | Platformă Inspecții Auto"
        description="Autentificare în platforma RoadReady pentru gestionarea inspecțiilor tehnice auto și managementul service-ului auto."
        keywords="login ITP, autentificare service auto, RoadReady login"
        ogUrl="https://roadready.ro/login"
        canonical="https://roadready.ro/login"
        noIndex={true}
      />
      <Login />
    </>
  );
};

export default LoginPage;
