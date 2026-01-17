import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  canonical?: string;
  noIndex?: boolean;
  structuredData?: object;
}

const SEO = ({
  title = 'RoadReady - Platformă Inspecții Tehnice Auto | Managementul ITP',
  description = 'Platforma completă pentru managementul inspecțiilor tehnice periodice (ITP) auto. Programări online, gestionare service auto, rapoarte detaliate și statistici pentru service-uri și clienți.',
  keywords = 'ITP, inspecție tehnică periodică, service auto, programare ITP, management service auto, inspecții auto, revizii tehnice, RoadReady, platformă ITP România',
  ogTitle,
  ogDescription,
  ogImage = 'https://roadready.ro/og-image.png',
  ogUrl = 'https://roadready.ro/',
  twitterCard = 'summary_large_image',
  canonical,
  noIndex = false,
  structuredData,
}: SEOProps) => {
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  const finalCanonical = canonical || ogUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="ro_RO" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={ogUrl} />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
