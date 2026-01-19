import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Star, Navigation } from 'lucide-react';
import clsx from 'clsx';
import { PublicStation } from '../../models/Branch';
import { formatDistance } from '../../utils/distance';

interface StationCardProps {
  station: PublicStation;
  onGetDirections?: (station: PublicStation) => void;
}

export const StationCard: FC<StationCardProps> = ({ station, onGetDirections }) => {
  const { t } = useTranslation();

  const formatAddress = () => {
    const parts = [
      station.address.street,
      station.address.streetNumber || station.address.houseNumber,
    ].filter(Boolean);

    const streetLine = parts.join(' ');
    const cityLine = [station.address.city, station.address.county].filter(Boolean).join(', ');

    return { streetLine, cityLine };
  };

  const { streetLine, cityLine } = formatAddress();

  const handleGetDirections = () => {
    if (onGetDirections) {
      onGetDirections(station);
    } else {
      // Default: open Google Maps
      const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
      window.open(url, '_blank');
    }
  };

  const handleCall = () => {
    if (station.phoneNumber) {
      window.location.href = `tel:${station.phoneNumber}`;
    }
  };

  return (
    <div
      className={clsx(
        'relative bg-surface rounded-xl border p-4 sm:p-5 transition-all duration-200',
        'hover:shadow-lg hover:border-primary/30',
        station.isSpotlight
          ? 'border-amber-400 shadow-md shadow-amber-100'
          : 'border-border'
      )}
    >
      {/* Spotlight Badge */}
      {station.isSpotlight && (
        <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 fill-current" />
          {t('stations.spotlight')}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-heading font-semibold text-text truncate">
            {station.name}
          </h3>
          {station.distance !== undefined && (
            <span className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-1">
              <Navigation className="w-3.5 h-3.5" />
              {formatDistance(station.distance)}
            </span>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 text-sm text-muted mb-3">
        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-muted/70" />
        <div>
          <p className="text-text">{streetLine}</p>
          <p>{cityLine}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        {station.phoneNumber && (
          <button
            onClick={handleCall}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-background hover:bg-primary/5 text-text font-medium text-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            {t('stations.call')}
          </button>
        )}
        <button
          onClick={handleGetDirections}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          {t('stations.directions')}
        </button>
      </div>
    </div>
  );
};
