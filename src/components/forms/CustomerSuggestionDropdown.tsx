import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Car, Phone, UserCheck } from 'lucide-react';
import { CustomerSearchResult } from '../../rtk/services/customer-search-service';

interface CustomerSuggestionDropdownProps {
  suggestions: CustomerSearchResult[];
  onSelect: (customer: CustomerSearchResult, car?: CustomerSearchResult['cars'][0]) => void;
  isLoading?: boolean;
}

const CustomerSuggestionDropdown: FC<CustomerSuggestionDropdownProps> = ({
  suggestions,
  onSelect,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg p-3">
        <div className="flex items-center justify-center gap-2 text-muted">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-body">{t('common.searching')}</span>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
      <div className="p-2 border-b border-border">
        <p className="text-xs text-muted font-body">{t('inspection.customerSuggestions')}</p>
      </div>

      {suggestions.map((customer) => (
        <div key={customer.id} className="border-b border-border last:border-b-0">
          {/* Customer header */}
          <button
            type="button"
            onClick={() => onSelect(customer)}
            className="w-full px-3 py-2 text-left hover:bg-primary/5 transition-colors flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-text font-heading truncate">
                  {customer.firstName} {customer.lastName}
                </span>
                {customer.isPortalUser && (
                  <span className="inline-flex items-center gap-1 text-xs bg-success/10 text-success px-1.5 py-0.5 rounded">
                    <UserCheck className="w-3 h-3" />
                    {t('inspection.portalUser')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted font-body">
                <Phone className="w-3 h-3" />
                {customer.phoneNumber}
              </div>
            </div>
          </button>

          {/* Customer's cars */}
          {customer.cars && customer.cars.length > 0 && (
            <div className="pl-11 pr-3 pb-2">
              {customer.cars.map((car) => (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => onSelect(customer, car)}
                  className="w-full px-2 py-1.5 text-left hover:bg-primary/5 rounded transition-colors flex items-center gap-2 text-sm"
                >
                  <Car className="w-3 h-3 text-muted" />
                  <span className="font-medium text-text">{car.licensePlate}</span>
                  {car.make && car.model && (
                    <span className="text-muted">
                      - {car.make} {car.model}
                    </span>
                  )}
                  <span className="text-xs text-muted bg-background px-1 rounded">{car.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomerSuggestionDropdown;
