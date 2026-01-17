import Terms from '../../components/terms/terms';
import SEO from '../../components/shared/SEO';

const TermsPage = () => {
  return (
    <>
      <SEO
        title="Termeni și Condiții - RoadReady | Platformă ITP"
        description="Termeni și condiții de utilizare a platformei RoadReady pentru managementul inspecțiilor tehnice auto."
        keywords="termeni și condiții, politica de confidențialitate, RoadReady"
        ogUrl="https://roadready.ro/terms"
        canonical="https://roadready.ro/terms"
      />
      <Terms />
    </>
  );
};

export default TermsPage;
