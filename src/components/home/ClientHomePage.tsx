import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useContext, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../contexts/authContext';
import { routes } from '../../constants/routes';
import logo from '../../assets/logo.png';
import carHome from '../../assets/car_home.png';
import { Button } from '../shared/Button';
import { useFetchPublicStationsQuery } from '../../rtk/services/stations-service';
import { useGeolocation } from '../../hooks/useGeolocation';
import { calculateDistance } from '../../utils/distance';
import { StationCard } from '../stations/StationCard';
import { PublicStation } from '../../models/Branch';
import {
  Search,
  MapPin,
  Loader2,
  AlertCircle,
  Star,
  Building2,
  ArrowRight,
  Shield,
  Clock,
  CheckCircle,
} from 'lucide-react';
import clsx from 'clsx';
import { brandName, contactEmail } from '../../constants/constants';

const ClientHomePage = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: stations = [], isLoading, error } = useFetchPublicStationsQuery();
  const { latitude, longitude, loading: locationLoading, requestLocation, hasLocation, error: locationError } = useGeolocation();

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
      if (a.isSpotlight && !b.isSpotlight) return -1;
      if (!a.isSpotlight && b.isSpotlight) return 1;
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [stations, hasLocation, latitude, longitude, searchQuery]);

  const spotlightStations = processedStations.filter((s) => s.isSpotlight);
  const regularStations = processedStations.filter((s) => !s.isSpotlight);

  return (
    <div className="min-h-screen bg-background text-text">
      {/* NAVIGATION */}
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

      {/* HERO SECTION */}
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-background/90 to-background z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/10 z-10" />
          <img
            src={carHome}
            alt=""
            className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity"
          />
        </div>
        {/* Background gradient orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6"
            >
              <MapPin className="w-4 h-4" />
              {t('home.client.badge')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 leading-tight"
            >
              <span className="text-text">{t('home.client.title1')}</span>{' '}
              <span className="text-primary">{t('home.client.title2')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-muted max-w-2xl mx-auto mb-8"
            >
              {t('home.client.subtitle')}
            </motion.p>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-xl mx-auto space-y-3"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('stations.searchPlaceholder')}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-surface text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-lg"
                />
              </div>

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
        </div>
      </section>

      {/* QUICK BENEFITS */}
      <section className="py-8 border-y border-border/30 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: <CheckCircle className="w-5 h-5" />, text: t('home.client.benefit1') },
              { icon: <MapPin className="w-5 h-5" />, text: t('home.client.benefit2') },
              { icon: <Clock className="w-5 h-5" />, text: t('home.client.benefit3') },
              { icon: <Shield className="w-5 h-5" />, text: t('home.client.benefit4') },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted">
                <span className="text-primary">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATIONS LIST */}
      <section className="py-12 sm:py-16">
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
                    {spotlightStations.slice(0, 3).map((station, index) => (
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
                  <h2 className="text-lg font-heading font-semibold text-text mb-4">
                    {hasLocation ? t('stations.nearYou') : t('stations.allStations')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {regularStations.slice(0, 6 - spotlightStations.length).map((station, index) => (
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

              {/* View All Button */}
              {processedStations.length > 6 && (
                <div className="text-center mt-8">
                  <Link to={routes.STATIONS}>
                    <Button variant="secondary" size="md" className="px-8">
                      {t('stations.viewAll')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA FOR STATION OWNERS */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-3">
            {t('home.client.ownerCta.title')}
          </h2>
          <p className="text-muted mb-6 max-w-lg mx-auto">
            {t('home.client.ownerCta.description')}
          </p>
          <Link to={routes.INSPECTOR_MODE}>
            <Button variant="primary" size="md" className="px-8">
              {t('home.client.ownerCta.button')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="RoadReady" className="h-8 w-8 rounded-lg" />
              <span className="text-lg font-bold font-heading text-primary">RoadReady</span>
            </div>

            <div className="text-muted text-sm">
              © {new Date().getFullYear()} {brandName}. {t('home.footer.rights')}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <Link to={routes.TERMS} className="text-muted hover:text-primary transition-colors">
                {t('home.footer.terms')}
              </Link>
              <a href={`mailto:${contactEmail}`} className="text-muted hover:text-primary transition-colors">
                {t('home.footer.contact')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientHomePage;
