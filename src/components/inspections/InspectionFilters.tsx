import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InspectionType } from '../../utils/enums/InspectionTypes';

export interface FilterConfig {
  customerName: boolean;
  inspectorName: boolean;
  licensePlate: boolean;
  inspectionType: string;
}

const DEFAULT_FILTER_CONFIG: FilterConfig = {
  customerName: true,
  inspectorName: true,
  licensePlate: true,
  inspectionType: '',
};

export interface InspectionsFiltersProps {
  filterConfig: FilterConfig;
  setFilterConfig: (config: FilterConfig) => void;
}

const InspectionsFilters: FC<InspectionsFiltersProps> = ({ filterConfig = DEFAULT_FILTER_CONFIG, setFilterConfig }) => {
  const { t } = useTranslation();

  const handleFilterChange = (key: keyof FilterConfig) => {
    setFilterConfig({ ...filterConfig, [key]: !filterConfig[key] });
  };

  return (
    <div className="w-full pl-12 py-2 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={filterConfig.customerName}
            onChange={() => handleFilterChange('customerName')}
            className="w-4 h-4 accent-primary cursor-pointer"
          />
          <span className="text-sm text-gray-600 select-none group-hover:text-gray-900">{t('customerName')}</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={filterConfig.inspectorName}
            onChange={() => handleFilterChange('inspectorName')}
            className="w-4 h-4 accent-primary cursor-pointer"
          />
          <span className="text-sm text-gray-600 select-none group-hover:text-gray-900">{t('inspectedBy')}</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={filterConfig.licensePlate}
            onChange={() => handleFilterChange('licensePlate')}
            className="w-4 h-4 accent-primary cursor-pointer"
          />
          <span className="text-sm text-gray-600 select-none group-hover:text-gray-900">{t('licensePlate')}</span>
        </label>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">{t('availability')}:</span>
          <select
            value={filterConfig.inspectionType}
            onChange={(e) => {
              setFilterConfig({
                ...filterConfig,
                inspectionType: e.target.value,
              });
            }}
            className="h-9 px-3 min-w-[150px] bg-white border border-gray-300 rounded-md text-sm 
            text-gray-600 cursor-pointer hover:border-primary focus:outline-none 
            focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">{t('inspectionTypes.allTypes')}</option>
            {Object.values(InspectionType).map((type) => (
              <option key={type} value={type}>
                {t(`inspectionTypes.${type.toLowerCase()}`)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default InspectionsFilters;
