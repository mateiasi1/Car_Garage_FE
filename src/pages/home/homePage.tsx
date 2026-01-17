import About from '../../components/home/about';
import SEO from '../../components/shared/SEO';

const HomePage = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'RoadReady - Platformă Inspecții Tehnice Auto',
    description:
      'Platformă completă pentru managementul inspecțiilor tehnice periodice (ITP) auto. Programări online, gestionare service auto, rapoarte detaliate.',
    url: 'https://roadready.ro/',
  };

  return (
    <>
      <SEO
        title="RoadReady - Platformă Inspecții Tehnice Auto | Managementul ITP"
        description="Platformă completă pentru managementul inspecțiilor tehnice periodice (ITP) auto. Programări online, gestionare service auto, rapoarte detaliate și statistici pentru service-uri și clienți."
        keywords="ITP, inspecție tehnică periodică, service auto, programare ITP, management service auto, inspecții auto, revizii tehnice, RoadReady, platformă ITP România"
        ogUrl="https://roadready.ro/"
        canonical="https://roadready.ro/"
        structuredData={structuredData}
      />
      <About />
    </>
  );
};

export default HomePage;
