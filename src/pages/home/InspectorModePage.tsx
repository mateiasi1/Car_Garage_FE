import InspectorPage from '../../components/home/InspectorPage';
import SEO from '../../components/shared/SEO';

const InspectorModePage = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'RoadReady - Platformă pentru Stații ITP',
    description:
      'Platformă completă pentru managementul stațiilor ITP. Gestionare inspecții tehnice periodice, rapoarte și notificări automate pentru clienți.',
    url: 'https://roadready.ro/inspector',
  };

  return (
    <>
      <SEO
        title="RoadReady - Platformă pentru Stații ITP | Management Inspecții Auto"
        description="Platformă completă pentru managementul stațiilor ITP. Gestionare inspecții tehnice periodice, rapoarte detaliate, notificări automate și statistici pentru service-uri."
        keywords="platformă ITP, management stație ITP, software ITP, inspecții tehnice periodice, gestionare service auto, rapoarte ITP, notificări ITP, RoadReady"
        ogUrl="https://roadready.ro/inspector"
        canonical="https://roadready.ro/inspector"
        structuredData={structuredData}
      />
      <InspectorPage />
    </>
  );
};

export default InspectorModePage;
