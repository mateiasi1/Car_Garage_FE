import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Car, Plus, Loader2, AlertCircle, ArrowLeft, Trash2, Edit, FileCheck, Bell } from 'lucide-react';
import { PageContainer } from '../../../components/shared/PageContainer';
import { Button } from '../../../components/shared/Button';
import { IconButton } from '../../../components/shared/IconButton';
import Drawer from '../../../components/shared/Drawer';
import CarForm from '../../../components/customer/CarForm';
import DocumentForm from '../../../components/customer/DocumentForm';
import ReminderForm from '../../../components/customer/ReminderForm';
import DeadlineCard from '../../../components/customer/DeadlineCard';
import {
  useFetchCustomerCarByIdQuery,
  useUpdateCustomerCarMutation,
  useDeleteCustomerCarMutation,
  useAddCarDocumentMutation,
  useDeleteCarDocumentMutation,
  useAddCarReminderMutation,
  useDeleteCarReminderMutation,
} from '../../../rtk/services/customer-profile-service';
import { routes } from '../../../constants/routes';
import { showToast } from '../../../utils/showToast';
import { UpdateCustomerCarDTO, AddCarDocumentDTO, AddCarReminderDTO } from '../../../interfaces/customer-portal.payload';

const CustomerCarDetailPage: FC = () => {
  const { t } = useTranslation();
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDocumentDrawerOpen, setIsDocumentDrawerOpen] = useState(false);
  const [isReminderDrawerOpen, setIsReminderDrawerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [documentFormKey, setDocumentFormKey] = useState(0);
  const [reminderFormKey, setReminderFormKey] = useState(0);

  const { data: car, isLoading, error } = useFetchCustomerCarByIdQuery(carId!, { skip: !carId });
  const [updateCar, { isLoading: isUpdating }] = useUpdateCustomerCarMutation();
  const [deleteCar, { isLoading: isDeleting }] = useDeleteCustomerCarMutation();
  const [addDocument, { isLoading: isAddingDocument }] = useAddCarDocumentMutation();
  const [deleteDocument] = useDeleteCarDocumentMutation();
  const [addReminder, { isLoading: isAddingReminder }] = useAddCarReminderMutation();
  const [deleteReminder] = useDeleteCarReminderMutation();

  const handleUpdateCar = async (data: UpdateCustomerCarDTO) => {
    if (!carId) return;
    try {
      await updateCar({ carId, data }).unwrap();
      showToast(t('customer.cars.updateSuccess'), 'success');
      setIsEditDrawerOpen(false);
    } catch {
      showToast(t('customer.cars.updateFailed'), 'error');
    }
  };

  const handleDeleteCar = async () => {
    if (!carId) return;
    try {
      await deleteCar(carId).unwrap();
      showToast(t('customer.cars.deleteSuccess'), 'success');
      navigate(routes.CUSTOMER_CARS);
    } catch {
      showToast(t('customer.cars.deleteFailed'), 'error');
    }
  };

  const handleAddDocument = async (data: AddCarDocumentDTO) => {
    try {
      await addDocument(data).unwrap();
      showToast(t('customer.documents.addSuccess'), 'success');
      setIsDocumentDrawerOpen(false);
    } catch {
      showToast(t('customer.documents.addFailed'), 'error');
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await deleteDocument(documentId).unwrap();
      showToast(t('customer.documents.deleteSuccess'), 'success');
    } catch {
      showToast(t('customer.documents.deleteFailed'), 'error');
    }
  };

  const handleAddReminder = async (data: AddCarReminderDTO) => {
    try {
      await addReminder(data).unwrap();
      showToast(t('customer.reminders.addSuccess'), 'success');
      setIsReminderDrawerOpen(false);
    } catch {
      showToast(t('customer.reminders.addFailed'), 'error');
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    try {
      await deleteReminder(reminderId).unwrap();
      showToast(t('customer.reminders.deleteSuccess'), 'success');
    } catch {
      showToast(t('customer.reminders.deleteFailed'), 'error');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <PageContainer className="px-2 sm:px-6 lg:px-10 py-4 sm:py-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="ml-3 text-text/70 font-body">{t('common.loading')}</span>
        </div>
      </PageContainer>
    );
  }

  if (error || !car) {
    return (
      <PageContainer className="px-2 sm:px-6 lg:px-10 py-4 sm:py-6">
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="w-12 h-12 text-error mb-4" />
          <p className="text-error font-body">{t('customer.cars.notFound')}</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate(routes.CUSTOMER_CARS)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('customer.cars.backToCars')}
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="px-2 sm:px-6 lg:px-10 py-4 sm:py-6 overflow-x-hidden">
      <div className="w-full max-w-5xl mx-auto overflow-x-hidden">
        {/* Back Button */}
        <Button variant="ghost" size="sm" onClick={() => navigate(routes.CUSTOMER_CARS)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('customer.cars.backToCars')}
        </Button>

        {/* Car Header */}
        <div className="bg-surface rounded-xl border border-border p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text font-heading">{car.licensePlate}</h1>
                <p className="text-muted font-body">
                  {car.make && car.model ? `${car.make} ${car.model}` : t('customer.cars.noMakeModel')}
                </p>
                <span className="text-xs text-muted bg-background px-2 py-1 rounded font-body mt-1 inline-block">
                  {t('customer.cars.category')}: {car.category}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <IconButton variant="ghost" size="sm" onClick={() => setIsEditDrawerOpen(true)}>
                <Edit className="w-4 h-4" />
              </IconButton>
              <IconButton variant="dangerGhost" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 className="w-4 h-4" />
              </IconButton>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text font-heading flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" />
              {t('customer.documents.title')}
            </h2>
            <Button variant="outline" size="sm" onClick={() => { setDocumentFormKey((k) => k + 1); setIsDocumentDrawerOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              {t('customer.documents.add')}
            </Button>
          </div>

          {car.documents && car.documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {car.documents.map((doc) => {
                const expiresAt = new Date(doc.expiresAt);
                const now = new Date();
                const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const isExpired = daysUntilExpiry < 0;

                return (
                  <DeadlineCard
                    key={doc.id}
                    deadline={{
                      id: doc.id,
                      carId: car.id,
                      carLicensePlate: car.licensePlate,
                      type: doc.type,
                      title: doc.title,
                      expiresAt: doc.expiresAt,
                      daysUntilExpiry,
                      isExpired,
                    }}
                    onClick={() => {}}
                    onDelete={() => handleDeleteDocument(doc.id)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="bg-background rounded-lg p-6 text-center border border-border">
              <FileCheck className="w-10 h-10 text-text/20 mx-auto mb-3" />
              <p className="text-muted font-body">{t('customer.documents.noDocuments')}</p>
            </div>
          )}
        </div>

        {/* Reminders Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text font-heading flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              {t('customer.reminders.title')}
            </h2>
            <Button variant="outline" size="sm" onClick={() => { setReminderFormKey((k) => k + 1); setIsReminderDrawerOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              {t('customer.reminders.add')}
            </Button>
          </div>

          {car.reminders && car.reminders.length > 0 ? (
            <div className="space-y-3">
              {car.reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-surface rounded-lg border border-border p-4 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-text font-heading">{reminder.title}</h4>
                    {reminder.description && (
                      <p className="text-sm text-muted font-body mt-1 whitespace-pre-wrap break-words">{reminder.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted font-body">
                      <span>{formatDate(reminder.expiresAt)}</span>
                      <span>{t('customer.reminders.daysBefore', { days: reminder.reminderDaysBefore })}</span>
                      {reminder.notifyViaSms && (
                        <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded">SMS</span>
                      )}
                    </div>
                  </div>
                  <IconButton variant="dangerGhost" size="sm" onClick={() => handleDeleteReminder(reminder.id)}>
                    <Trash2 className="w-4 h-4" />
                  </IconButton>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-background rounded-lg p-6 text-center border border-border">
              <Bell className="w-10 h-10 text-text/20 mx-auto mb-3" />
              <p className="text-muted font-body">{t('customer.reminders.noReminders')}</p>
            </div>
          )}
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-text/30 backdrop-blur-sm">
            <div className="bg-surface rounded-xl border border-border p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-text mb-2 font-heading">
                {t('customer.cars.confirmDelete')}
              </h3>
              <p className="text-muted font-body mb-4">
                {t('customer.cars.confirmDeleteDesc', { plate: car.licensePlate })}
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} fullWidth>
                  {t('common.cancel')}
                </Button>
                <Button variant="danger" onClick={handleDeleteCar} loading={isDeleting} fullWidth>
                  {t('common.delete')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Car Drawer */}
        <Drawer isOpen={isEditDrawerOpen} onClose={() => setIsEditDrawerOpen(false)} title={t('customer.cars.editCar')}>
          <CarForm
            car={car}
            onSubmit={handleUpdateCar as any}
            onCancel={() => setIsEditDrawerOpen(false)}
            isLoading={isUpdating}
          />
        </Drawer>

        {/* Add Document Drawer */}
        <Drawer
          isOpen={isDocumentDrawerOpen}
          onClose={() => setIsDocumentDrawerOpen(false)}
          title={t('customer.documents.add')}
        >
          <DocumentForm
            key={documentFormKey}
            carId={car.id}
            onSubmit={handleAddDocument}
            onCancel={() => setIsDocumentDrawerOpen(false)}
            isLoading={isAddingDocument}
          />
        </Drawer>

        {/* Add Reminder Drawer */}
        <Drawer
          isOpen={isReminderDrawerOpen}
          onClose={() => setIsReminderDrawerOpen(false)}
          title={t('customer.reminders.add')}
        >
          <ReminderForm
            key={reminderFormKey}
            cars={[car]}
            selectedCarId={car.id}
            onSubmit={handleAddReminder}
            onCancel={() => setIsReminderDrawerOpen(false)}
            isLoading={isAddingReminder}
          />
        </Drawer>
      </div>
    </PageContainer>
  );
};

export default CustomerCarDetailPage;
