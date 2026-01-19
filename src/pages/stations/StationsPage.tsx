import { FC, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, MapPin, Loader2, AlertCircle, Star, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFetchPublicStationsQuery } from '../../rtk/services/stations-service';
import { useGeolocation } from '../../hooks/useGeolocation';
import { calculateDistance } from '../../utils/distance';
import { StationCard } from '../../components/stations/StationCard';
import { PublicStation } from '../../models/Branch';
import { routes } from '../../constants/routes';
import { Button } from '../../components/shared/Button';
import SEO from '../../components/shared/SEO';
import clsx from 'clsx';
import { AuthContext } from '../../contexts/authContext';
import logo from '../../assets/logo.png';

const StationsPage: FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: stations = [], isLoading, error } = useFetchPublicStationsQuery();
  const { latitude, longitude, loading: locationLoading, requestLocation, hasLocation, error: locationError } = useGeolocation();
  const { isAuthenticated } = useContext(AuthContext);
  
  // Calculate distances and sort stations
  const processedStations = useMemo(() => {
    let result: PublicStation[] = [...stations];

    // Add distance if user location is available
    if (hasLocation && latitude && longitude) {
      result = result.map((station) => ({
        ...station,
        distance: calculateDistance(latitude, longitude, station.latitude, station.longitude),
      }));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const queryWords = query.split(/\s+/).filter((word) => word.length > 0);

      result = result.filter((station) => {
        // Create searchable text from all relevant fields
        const searchableText = [
          station.name,
          station.address.street,
          station.address.city,
          station.address.county,
          station.address.streetNumber,
          station.address.houseNumber,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        // Check if all query words are found in the searchable text
        return queryWords.every((word) => searchableText.includes(word));
      });
    }

    // Sort: spotlight first, then by distance (if available), then alphabetically
    result.sort((a, b) => {
      // Spotlight stations always first
      if (a.isSpotlight && !b.isSpotlight) return -1;
      if (!a.isSpotlight && b.isSpotlight) return 1;

      // Within same spotlight status, sort by distance if available
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }

      // Fallback to alphabetical
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [stations, hasLocation, latitude, longitude, searchQuery]);

  // Separate spotlight and regular stations
  const spotlightStations = processedStations.filter((s) => s.isSpotlight);
  const regularStations = processedStations.filter((s) => !s.isSpotlight);

  // Generate structured data for stations (for SEO)
  const stationsStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Stații ITP România',
    description: 'Lista stațiilor ITP autorizate din România pentru inspecții tehnice periodice auto',
    numberOfItems: stations.length,
    itemListElement: stations.slice(0, 10).map((station, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'AutoRepair',
        name: station.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: `${station.address.street} ${station.address.streetNumber || station.address.houseNumber || ''}`.trim(),
          addressLocality: station.address.city,
          addressRegion: station.address.county,
          addressCountry: 'RO',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: station.latitude,
          longitude: station.longitude,
        },
        telephone: station.phoneNumber,
      },
    })),
  };

  return (
    <>
      <SEO
        title="Stații ITP România - Găsește Inspecție Tehnică Periodică Lângă Tine | RoadReady"
        description="Caută stații ITP autorizate în România. Găsește inspecția tehnică periodică (ITP) cel mai aproape de tine, obține indicații și informații de contact. Verificare ITP rapidă și sigură."
        keywords="stații ITP, ITP lângă mine, inspecție tehnică periodică, ITP România, găsește ITP, verificare ITP, statie ITP aproape, ITP auto, service ITP, control tehnic auto, inspectie tehnica"
        canonical="https://roadready.ro/stations"
        ogUrl="https://roadready.ro/stations"
        ogTitle="Stații ITP România - Găsește Inspecție Tehnică Periodică"
        ogDescription="Caută stații ITP autorizate în România. Găsește ITP-ul cel mai aproape de tine."
        structuredData={stationsStructuredData}
      />

      <div className="min-h-screen bg-background">
           <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to={routes.HOME} className="flex items-center gap-2">
              <img src={logo} alt="RoadReady" className="h-9 w-9 rounded-lg" />
              <span className="text-xl font-bold font-heading text-primary hidden sm:block">RoadReady</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to={routes.INSPECTOR_MODE}>
                <Button variant="secondary" size="sm" className="text-text/70 hover:text-primary">
                  <Building2 className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline">{t('home.inspectorMode')}</span>
                  <span className="sm:hidden">{t('home.inspectorModeShort')}</span>
                </Button>
              </Link>
              {isAuthenticated && (
                <Link to={routes.ADMINISTRATION_SHORT}>
                  <Button variant="primary" size="sm">
                    {t('loginButton')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

        {/* Hero Section */}
        <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text mb-3">
                {t('stations.title')}
              </h1>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                {t('stations.subtitle')}
              </p>
            </motion.div>

            {/* Search & Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl mx-auto space-y-4"
            >
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('stations.searchPlaceholder')}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-surface text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Location Button */}
              {!hasLocation && (
                <button
                  onClick={requestLocation}
                  disabled={locationLoading}
                  className={clsx(
                    'w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/30 bg-primary/5 text-primary font-medium transition-colors',
                    locationLoading ? 'opacity-70 cursor-wait' : 'hover:bg-primary/10'
                  )}
                >
                  {locationLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <MapPin className="w-5 h-5" />
                  )}
                  {locationLoading ? t('stations.locating') : t('stations.useMyLocation')}
                </button>
              )}

              {locationError && (
                <p className="text-sm text-amber-600 text-center flex items-center justify-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {t('stations.locationError')}
                </p>
              )}

              {hasLocation && (
                <p className="text-sm text-primary text-center flex items-center justify-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {t('stations.locationActive')}
                </p>
              )}
            </motion.div>
          </div>
        </section>

        {/* Stations List */}
        <section className="py-8 sm:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
                <p className="text-muted">{t('stations.loadError')}</p>
              </div>
            ) : processedStations.length === 0 ? (
              <div className="text-center py-16">
                <MapPin className="w-12 h-12 text-muted/50 mx-auto mb-4" />
                <p className="text-muted">
                  {searchQuery ? t('stations.noResults') : t('stations.noStations')}
                </p>
              </div>
            ) : (
              <>
                {/* Spotlight Section */}
                {spotlightStations.length > 0 && (
                  <div className="mb-8">
                    <h2 className="flex items-center gap-2 text-lg font-heading font-semibold text-text mb-4">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      {t('stations.spotlightTitle')}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {spotlightStations.map((station, index) => (
                        <motion.div
                          key={station.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <StationCard station={station} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Stations */}
                {regularStations.length > 0 && (
                  <div>
                    {spotlightStations.length > 0 && (
                      <h2 className="text-lg font-heading font-semibold text-text mb-4">
                        {t('stations.allStations')}
                      </h2>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {regularStations.map((station, index) => (
                        <motion.div
                          key={station.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (spotlightStations.length + index) * 0.03 }}
                        >
                          <StationCard station={station} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Results count */}
                <p className="text-center text-sm text-muted mt-8">
                  {t('stations.resultsCount', { count: processedStations.length })}
                </p>
              </>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-surface border-t border-border py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm text-muted">
              &copy; {new Date().getFullYear()} RoadReady. {t('footer.allRightsReserved')}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default StationsPage;
