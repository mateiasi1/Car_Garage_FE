import { faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setSelectedInspection } from '../../slices/inspectionSlice';
import InspectionsFilters, { FilterConfig } from './InspectionFilters';

type InspectionToolbarProps = {
  search: string;
  setSearch: (value: string) => void;
  onSearch: (searchTerm: string) => void;
  filterConfig: FilterConfig;
  setFilterConfig: (config: FilterConfig) => void;
};

const InspectionsToolbar: FC<InspectionToolbarProps> = ({
  search,
  setSearch,
  onSearch,
  filterConfig,
  setFilterConfig,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectedInspection = useAppSelector((state) => state.inspection.selectedInspection);
  const dispatch = useAppDispatch();
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(search);
  };

  const handleAddInspection = () => {
    if (selectedInspection) {
      dispatch(setSelectedInspection(null));
    }

    navigate('/add-inspection');
  };

  return (
    <div className="space-y-4 mb-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 transition-colors ${showFilters ? 'text-primary' : 'text-gray-600'} hover:text-primary`}
        >
          <FontAwesomeIcon icon={faFilter} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchInspections')}
              className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary-hover cursor-pointer"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </form>
        <button
          onClick={handleAddInspection}
          className="px-6 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary-hover transition-colors whitespace-nowrap"
        >
          {t('addNewInspection')}
        </button>
      </div>
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          showFilters ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <InspectionsFilters filterConfig={filterConfig} setFilterConfig={setFilterConfig} />
      </div>
    </div>
  );
};

export default InspectionsToolbar;
