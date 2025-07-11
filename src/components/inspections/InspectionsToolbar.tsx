import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type InspectionToolbarProps = {
  search: string;
  setSearch: (value: string) => void;
};

const InspectionsToolbar: FC<InspectionToolbarProps> = ({ search, setSearch }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex items-center mb-6 flex-shrink-0">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('searchInspections')}
        className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        onClick={() => navigate('/add-inspection')}
        className="ml-4 px-6 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
      >
        {t('addNewInspection')}
      </button>
    </div>
  );
};

export default InspectionsToolbar;
