import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Clock, FileText, Users } from 'lucide-react';
import { useDemo } from '../../hooks/useDemo';

/**
 * DemoBanner - Displays demo account information and limitations
 * Shows at the top of the page for demo users
 */
export const DemoBanner: FC = () => {
  const { t } = useTranslation();
  const { isDemo, daysRemaining, inspectionsUsed, inspectionsMax, customersUsed, customersMax } = useDemo();

  if (!isDemo) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Title and expiration */}
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <span className="font-semibold text-amber-800">{t('demo.title')}</span>
            <span className="text-amber-700 ml-2">—</span>
            <span className="text-amber-700 ml-2 text-sm">
              {t('demo.limitedFeatures')}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {/* Days remaining */}
          <div className="flex items-center gap-1.5 text-amber-700">
            <Clock className="w-4 h-4" />
            <span>
              {daysRemaining} {t('demo.daysRemaining')}
            </span>
          </div>

          {/* Inspections */}
          <div className="flex items-center gap-1.5 text-amber-700">
            <FileText className="w-4 h-4" />
            <span>
              {inspectionsUsed}/{inspectionsMax} {t('demo.inspections')}
            </span>
          </div>

          {/* Customers */}
          <div className="flex items-center gap-1.5 text-amber-700">
            <Users className="w-4 h-4" />
            <span>
              {customersUsed}/{customersMax} {t('demo.customers')}
            </span>
          </div>
        </div>
      </div>

      {/* Warning if limits are close */}
      {(inspectionsUsed >= inspectionsMax || customersUsed >= customersMax || daysRemaining <= 5) && (
        <div className="mt-2 pt-2 border-t border-amber-200 text-sm text-amber-700">
          {inspectionsUsed >= inspectionsMax && (
            <p>{t('demo.inspectionsLimitReached')}</p>
          )}
          {customersUsed >= customersMax && (
            <p>{t('demo.customersLimitReached')}</p>
          )}
          {daysRemaining <= 5 && daysRemaining > 0 && (
            <p>{t('demo.expiringSoon')}</p>
          )}
          {daysRemaining <= 0 && <p>{t('demo.expired')}</p>}
          <p className="mt-1 font-medium">
            {t('demo.contactUs')}
          </p>
        </div>
      )}
    </div>
  );
};

export default DemoBanner;

