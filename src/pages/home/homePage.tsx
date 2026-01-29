import ClientHomePage from '../../components/home/ClientHomePage';
import SEO from '../../components/shared/SEO';

const HomePage = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'RoadReady - Inspecție ITP | Stații ITP România | Inspecție Tehnică Periodică',
    description:
      'Inspecție ITP - Găsește stații ITP autorizate în România. Caută stații ITP lângă tine, obține indicații, programează inspecția tehnică periodică și urmărește documentele vehiculului.',
    url: 'https://roadready.ro/',
    inLanguage: 'ro',
    isPartOf: {
      '@type': 'WebSite',
      name: 'RoadReady',
      url: 'https://roadready.ro',
    },
    about: {
      '@type': 'Thing',
      name: 'Inspecție Tehnică Periodică (ITP)',
      description: 'Control tehnic obligatoriu pentru vehiculele înmatriculate în România',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Acasă',
          item: 'https://roadready.ro/',
        },
      ],
    },
  };

  return (
    <>
      <SEO
        title="Inspecție ITP - Stații ITP România | Inspecție Tehnică Periodică | RoadReady"
        description="Inspecție ITP - Găsește stații ITP autorizate lângă tine. Inspecție tehnică periodică auto, programări online, verificare ITP, urmărire documente RCA și rovinietă. Platforma #1 pentru ITP în România."
        keywords="inspectie ITP, inspectie tehnica periodica, ITP, stații ITP, ITP lângă mine, inspectie periodica, inspectie tehnica auto, verificare ITP, ITP România, statie ITP aproape, caută ITP, găsește stație ITP, ITP auto, programare ITP, RoadReady, control tehnic auto, verificare vehicul, ITP expirat, valabilitate ITP, ITP moto, RCA, rovinietă"
        ogUrl="https://roadready.ro/"
        ogTitle="RoadReady - Inspecție ITP | Stații ITP România"
        ogDescription="Găsește stații ITP autorizate lângă tine. Inspecție tehnică periodică, programări online, urmărire documente auto."
        canonical="https://roadready.ro/"
        structuredData={structuredData}
      />
      <ClientHomePage />
    </>
  );
};

export default HomePage;
