import { FC, useLayoutEffect, useRef, useState } from 'react';
import InspectionsPagination from '../../components/inspections/InspectionsPagination';
import InspectionsTableBody from '../../components/inspections/InspectionsTableBody';
import InspectionsTableHeader from '../../components/inspections/InspectionsTableHeader';
import InspectionsToolbar from '../../components/inspections/InspectionsToolbar';
import { InspectionsFilters, useFetchInspectionsQuery } from '../../rtk/services/inspections-service';

const InspectionsPage: FC = () => {
  const [search, setSearch] = useState<string>('');
  const [filters, setFilters] = useState<InspectionsFilters>({
    page: 1,
    licensePlate: '',
    inspectionType: '',
    customerName: '',
    inspectorName: '',
  });
  const { data, isLoading } = useFetchInspectionsQuery(filters);

  const bodyRef = useRef<HTMLDivElement>(null);
  const [showScrollbarGutter, setShowScrollbarGutter] = useState(false);

  const inspections = data?.results || [];
  const totalPages = data?.totalPages || 1;

  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (el) {
      setShowScrollbarGutter(el.scrollHeight > el.clientHeight);
    }
  }, [inspections, isLoading]);

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background p-6">
      <div className="w-full bg-white rounded-xl shadow-md p-4 flex flex-col mt-12 h-[calc(100vh-6rem)]">
        <InspectionsToolbar search={search} setSearch={setSearch} />
        <div className="flex flex-col flex-1 min-h-0 w-full">
          <div className="w-full">
            <InspectionsTableHeader showScrollbarGutter={showScrollbarGutter} />
          </div>
          <div ref={bodyRef} className="flex-1 min-h-0 overflow-y-auto w-full">
            <InspectionsTableBody inspections={inspections} isLoading={isLoading} page={filters.page} />
          </div>
        </div>
        <InspectionsPagination page={filters.page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default InspectionsPage;
