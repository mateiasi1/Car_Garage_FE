import InspectorPage from '../../components/home/InspectorPage';
import SEO from '../../components/shared/SEO';

const InspectorModePage = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'RoadReady - Platformă Management Stații ITP | Software Inspecție Tehnică Periodică',
    description:
      'Platformă completă pentru managementul stațiilor ITP. Gestionare inspecții tehnice periodice, rapoarte, notificări automate SMS și urmărire clienți.',
    url: 'https://roadready.ro/inspector',
    inLanguage: 'ro',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Acasă',
          item: 'https://roadready.ro/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Pentru Stații ITP',
          item: 'https://roadready.ro/inspector',
        },
      ],
    },
  };

  return (
    <>
      <SEO
        title="Software Stație ITP - Management Inspecții Tehnice Periodice | RoadReady"
        description="Software complet pentru stații ITP. Gestionare inspecții tehnice periodice, notificări automate SMS pentru clienți, rapoarte detaliate și statistici. Înregistrează-ți stația ITP pe RoadReady."
        keywords="software stație ITP, platformă ITP, management stație ITP, software inspecție tehnică periodică, gestionare inspecții ITP, notificări ITP, rapoarte ITP, RoadReady, software service auto, program stație ITP"
        ogUrl="https://roadready.ro/inspector"
        canonical="https://roadready.ro/inspector"
        ogTitle="Software Stație ITP - Management Inspecții Tehnice Periodice"
        ogDescription="Software complet pentru stații ITP. Gestionare inspecții, notificări SMS automate, rapoarte detaliate."
        structuredData={structuredData}
      />
      <InspectorPage />
    </>
  );
};

export default InspectorModePage;
