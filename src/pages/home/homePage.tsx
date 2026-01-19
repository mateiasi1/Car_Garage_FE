import ClientHomePage from '../../components/home/ClientHomePage';
import SEO from '../../components/shared/SEO';

const HomePage = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'RoadReady - Găsește Stații ITP în România',
    description:
      'Găsește stații ITP autorizate în România. Caută stații ITP lângă tine, obține indicații și programează inspecția tehnică periodică.',
    url: 'https://roadready.ro/',
  };

  return (
    <>
      <SEO
        title="RoadReady - Stații ITP România | Găsește Inspecție Tehnică Periodică Lângă Tine"
        description="Găsește stații ITP autorizate în România. Caută stații ITP lângă tine, obține indicații și informații de contact. Verificare ITP rapidă și sigură."
        keywords="stații ITP, ITP lângă mine, inspecție tehnică periodică, ITP România, găsește ITP, verificare ITP, statie ITP aproape, ITP auto, service ITP, control tehnic auto"
        ogUrl="https://roadready.ro/"
        canonical="https://roadready.ro/"
        structuredData={structuredData}
      />
      <ClientHomePage />
    </>
  );
};

export default HomePage;
