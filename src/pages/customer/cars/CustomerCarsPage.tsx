import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Car, Plus, Loader2, AlertCircle } from 'lucide-react';
import { PageContainer } from '../../../components/shared/PageContainer';
import { PageHeader } from '../../../components/shared/PageHeader';
import { Button } from '../../../components/shared/Button';
import Drawer from '../../../components/shared/Drawer';
import CarForm from '../../../components/customer/CarForm';
import {
  useFetchCustomerCarsQuery,
  useAddCustomerCarMutation,
} from '../../../rtk/services/customer-profile-service';
import { routes } from '../../../constants/routes';
import { showToast } from '../../../utils/showToast';
import { AddCustomerCarDTO } from '../../../interfaces/customer-portal.payload';

const CustomerCarsPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const { data: cars, isLoading, error } = useFetchCustomerCarsQuery();
  const [addCar, { isLoading: isAdding }] = useAddCustomerCarMutation();

  // Open drawer if navigated with state
  useEffect(() => {
    const state = location.state as { openAddCar?: boolean } | null;
    if (state?.openAddCar) {
      setIsAddDrawerOpen(true);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleAddCar = async (data: AddCustomerCarDTO) => {
    try {
      await addCar(data).unwrap();
      showToast(t('customer.cars.addSuccess'), 'success');
      setIsAddDrawerOpen(false);
      setFormKey((k) => k + 1);
    } catch {
      showToast(t('customer.cars.addFailed'), 'error');
    }
  };

  const handleCarClick = (carId: string) => {
    navigate(routes.CUSTOMER_CAR_DETAIL.replace(':carId', carId));
  };

  const getDocumentStatusColor = (documents: { daysUntilExpiry?: number; isExpired?: boolean }[]) => {
    if (!documents || documents.length === 0) return 'bg-gray-100 text-gray-600';

    const hasExpired = documents.some((d) => d.isExpired);
    const hasExpiringSoon = documents.some((d) => !d.isExpired && (d.daysUntilExpiry ?? 999) <= 30);

    if (hasExpired) return 'bg-error/10 text-error';
    if (hasExpiringSoon) return 'bg-warning/10 text-warning';
    return 'bg-success/10 text-success';
  };

  return (
    <PageContainer className="px-2 sm:px-6 lg:px-10 py-4 sm:py-6 overflow-x-hidden">
      <div className="w-full max-w-5xl mx-auto overflow-x-hidden">
        <PageHeader
          icon={Car}
          title={t('customer.cars.title')}
          action={
            <Button variant="primary" size="sm" onClick={() => setIsAddDrawerOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('customer.cars.addCar')}
            </Button>
          }
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-text/70 font-body">{t('common.loading')}</span>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-error mb-4" />
            <p className="text-error font-body">{t('common.error')}</p>
          </div>
        )}

        {/* Cars Grid */}
        {!isLoading && !error && cars && (
          <>
            {cars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cars.map((car) => (
                  <div
                    key={car.id}
                    onClick={() => handleCarClick(car.id)}
                    className="bg-surface rounded-xl border border-border p-5 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Car className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-text font-heading">{car.licensePlate}</h3>
                          <p className="text-sm text-muted font-body">
                            {car.make && car.model ? `${car.make} ${car.model}` : t('customer.cars.noMakeModel')}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted bg-background px-2 py-1 rounded font-body">
                        {car.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDocumentStatusColor(car.documents as any)}`}>
                        {car.documents?.length || 0} {t('customer.cars.documents')}
                      </span>
                      {car.reminders && car.reminders.length > 0 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 font-medium">
                          {car.reminders.length} {t('customer.cars.reminders')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface rounded-xl border border-border p-8 text-center">
                <Car className="w-16 h-16 text-text/20 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text mb-2 font-heading">
                  {t('customer.cars.noCars')}
                </h3>
                <p className="text-muted font-body mb-4">{t('customer.cars.noCarsDesc')}</p>
                <Button variant="primary" onClick={() => setIsAddDrawerOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('customer.cars.addFirstCar')}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Add Car Drawer */}
        <Drawer isOpen={isAddDrawerOpen} onClose={() => setIsAddDrawerOpen(false)} title={t('customer.cars.addCar')}>
          <CarForm
            key={formKey}
            onSubmit={handleAddCar as any}
            onCancel={() => setIsAddDrawerOpen(false)}
            isLoading={isAdding}
          />
        </Drawer>
      </div>
    </PageContainer>
  );
};

export default CustomerCarsPage;
