import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Plus, Loader2, AlertCircle, FileCheck, ArrowRight, Bell, FileText, ChevronRight } from 'lucide-react';
import { PageContainer } from '../../../components/shared/PageContainer';
import { Button } from '../../../components/shared/Button';
import DeadlineCard from '../../../components/customer/DeadlineCard';
import { useFetchCustomerDashboardQuery } from '../../../rtk/services/customer-profile-service';
import { routes } from '../../../constants/routes';
import { customerSession } from '../../../utils/customerSession';

const CustomerDashboardPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = customerSession.getUser();

  const { data: dashboardData, isLoading, error } = useFetchCustomerDashboardQuery();

  // Safe defaults for dashboard data
  const safeData = dashboardData ? {
    carsCount: dashboardData.carsCount ?? 0,
    activeReminders: dashboardData.activeReminders ?? 0,
    expiredDocuments: dashboardData.expiredDocuments ?? 0,
    upcomingDeadlines: dashboardData.upcomingDeadlines ?? [],
  } : null;

  const handleAddCar = () => {
    navigate(routes.CUSTOMER_CARS, { state: { openAddCar: true } });
  };

  const handleDeadlineClick = (carId: string) => {
    navigate(routes.CUSTOMER_CAR_DETAIL.replace(':carId', carId));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('customer.dashboard.greetingMorning');
    if (hour < 18) return t('customer.dashboard.greetingAfternoon');
    return t('customer.dashboard.greetingEvening');
  };

  return (
    <PageContainer className="px-2 sm:px-6 lg:px-10 py-4 sm:py-6 overflow-x-hidden">
      <div className="w-full max-w-5xl mx-auto overflow-x-hidden">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text font-heading">
                {getGreeting()}, {user?.firstName || t('customer.dashboard.user')}!
              </h1>
              <p className="text-muted mt-1">{t('customer.dashboard.welcomeMessage')}</p>
            </div>
            <Button variant="primary" size="sm" onClick={handleAddCar}>
              <Plus className="w-4 h-4 mr-2" />
              {t('customer.dashboard.addCar')}
            </Button>
          </div>
        </motion.div>

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

        {/* Dashboard Content */}
        {!isLoading && !error && safeData && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                {
                  icon: <Car className="w-5 h-5" />,
                  value: safeData.carsCount,
                  label: t('customer.dashboard.myCars'),
                  color: 'primary',
                  link: routes.CUSTOMER_CARS,
                },
                {
                  icon: <Bell className="w-5 h-5" />,
                  value: safeData.activeReminders,
                  label: t('customer.dashboard.activeReminders'),
                  color: 'success',
                },
                {
                  icon: <AlertCircle className="w-5 h-5" />,
                  value: safeData.upcomingDeadlines.filter((d) => d.daysUntilExpiry <= 30 && !d.isExpired).length,
                  label: t('customer.dashboard.expiringSoon'),
                  color: 'warning',
                },
                {
                  icon: <FileText className="w-5 h-5" />,
                  value: safeData.expiredDocuments,
                  label: t('customer.dashboard.expiredDocs'),
                  color: 'error',
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`bg-surface rounded-xl border border-border p-4 hover:border-${card.color}/30 transition-colors ${card.link ? 'cursor-pointer' : ''}`}
                  onClick={() => card.link && navigate(card.link)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-${card.color}/10 flex items-center justify-center text-${card.color}`}>
                      {card.icon}
                    </div>
                    {card.link && <ChevronRight className="w-4 h-4 text-muted" />}
                  </div>
                  <p className="text-2xl font-bold text-text font-heading">{card.value}</p>
                  <p className="text-sm text-muted font-body">{card.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions for empty state */}
            {safeData.carsCount === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl border border-primary/20 p-6 sm:p-8"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Car className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text mb-1 font-heading">
                      {t('customer.dashboard.getStarted')}
                    </h3>
                    <p className="text-muted font-body">{t('customer.dashboard.getStartedDesc')}</p>
                  </div>
                  <Button variant="primary" onClick={handleAddCar} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('customer.dashboard.addCar')}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Upcoming Deadlines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text font-heading">
                  {t('customer.dashboard.upcomingDeadlines')}
                </h2>
                {safeData.upcomingDeadlines.length > 3 && (
                  <Link
                    to={routes.CUSTOMER_CARS}
                    className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1"
                  >
                    {t('customer.dashboard.viewAll')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {safeData.upcomingDeadlines.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {safeData.upcomingDeadlines.slice(0, 6).map((deadline, index) => (
                    <motion.div
                      key={deadline.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    >
                      <DeadlineCard
                        deadline={deadline}
                        onClick={() => handleDeadlineClick(deadline.carId)}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : safeData.carsCount > 0 ? (
                <div className="bg-surface rounded-xl border border-border p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <FileCheck className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="font-semibold text-text mb-2">{t('customer.dashboard.allGood')}</h3>
                  <p className="text-muted font-body">{t('customer.dashboard.noDeadlinesDesc')}</p>
                </div>
              ) : (
                <div className="bg-surface rounded-xl border border-border p-8 text-center">
                  <FileCheck className="w-12 h-12 text-text/20 mx-auto mb-4" />
                  <p className="text-text/60 font-body mb-4">{t('customer.dashboard.noDeadlines')}</p>
                  <Button variant="secondary" size="sm" onClick={handleAddCar}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('customer.dashboard.addFirstCar')}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default CustomerDashboardPage;
