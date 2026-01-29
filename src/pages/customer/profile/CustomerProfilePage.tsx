import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { User, Loader2, AlertCircle, Building2, Bell, Save } from 'lucide-react';
import { PageContainer } from '../../../components/shared/PageContainer';
import { PageHeader } from '../../../components/shared/PageHeader';
import { CustomInput } from '../../../components/shared/CustomInput';
import { CustomSelect } from '../../../components/shared/CustomSelect';
import { Button } from '../../../components/shared/Button';
import {
  useFetchCustomerProfileQuery,
  useUpdateCustomerProfileMutation,
} from '../../../rtk/services/customer-profile-service';
import { showToast } from '../../../utils/showToast';
import { NotificationPreference } from '../../../models/CustomerProfile';
import { customerSession } from '../../../utils/customerSession';
import { routes } from '../../../constants/routes';

const notificationOptions = [
  { value: 'SMS', labelKey: 'customer.profile.notifySms' },
  { value: 'APP', labelKey: 'customer.profile.notifyApp' },
  { value: 'BOTH', labelKey: 'customer.profile.notifyBoth' },
];

const CustomerProfilePage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    customerSession.clear();
    navigate(routes.CUSTOMER_LOGIN);
  };

  const { data: profile, isLoading, error } = useFetchCustomerProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateCustomerProfileMutation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [notificationPreference, setNotificationPreference] = useState<NotificationPreference>('BOTH');
  const [isEditing, setIsEditing] = useState(false);

  // Set initial values when profile loads
  useState(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setNotificationPreference(profile.notificationPreference);
    }
  });

  const handleEdit = () => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setNotificationPreference(profile.notificationPreference);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setNotificationPreference(profile.notificationPreference);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        firstName,
        lastName,
        notificationPreference,
      }).unwrap();
      showToast(t('customer.profile.updateSuccess'), 'success');
      setIsEditing(false);
    } catch {
      showToast(t('customer.profile.updateFailed'), 'error');
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

  if (error || !profile) {
    return (
      <PageContainer className="px-2 sm:px-6 lg:px-10 py-4 sm:py-6">
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="w-12 h-12 text-error mb-4" />
          <p className="text-error font-body">{t('common.error')}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="px-2 sm:px-6 lg:px-10 py-4 sm:py-6 overflow-x-hidden">
      <div className="w-full max-w-3xl mx-auto overflow-x-hidden">
        <PageHeader icon={User} title={t('customer.profile.title')} />

        {/* Personal Info Section */}
        <div className="bg-surface rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text font-heading">
              {t('customer.profile.personalInfo')}
            </h2>
            {!isEditing && (
              <Button variant="secondary" size="sm" onClick={handleEdit}>
                {t('common.edit')}
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <CustomInput
                label={t('customer.profile.firstName')}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                isRequired
              />

              <CustomInput
                label={t('customer.profile.lastName')}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                isRequired
              />

              <div className="bg-background rounded-lg p-3 border border-border">
                <p className="text-xs text-muted font-body">{t('customer.profile.phone')}</p>
                <p className="text-sm text-text font-medium font-body">{profile.phoneNumber}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" onClick={handleCancel} fullWidth disabled={isUpdating}>
                  {t('common.cancel')}
                </Button>
                <Button variant="primary" onClick={handleSave} fullWidth loading={isUpdating}>
                  <Save className="w-4 h-4 mr-2" />
                  {t('common.save')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-lg p-3 border border-border">
                  <p className="text-xs text-muted font-body">{t('customer.profile.firstName')}</p>
                  <p className="text-sm text-text font-medium font-body">{profile.firstName}</p>
                </div>
                <div className="bg-background rounded-lg p-3 border border-border">
                  <p className="text-xs text-muted font-body">{t('customer.profile.lastName')}</p>
                  <p className="text-sm text-text font-medium font-body">{profile.lastName}</p>
                </div>
              </div>

              <div className="bg-background rounded-lg p-3 border border-border">
                <p className="text-xs text-muted font-body">{t('customer.profile.phone')}</p>
                <p className="text-sm text-text font-medium font-body">{profile.phoneNumber}</p>
              </div>

              <div className="bg-background rounded-lg p-3 border border-border">
                <p className="text-xs text-muted font-body">{t('customer.profile.memberSince')}</p>
                <p className="text-sm text-text font-medium font-body">{formatDate(profile.createdAt)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Notification Preferences Section */}
        <div className="bg-surface rounded-xl border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-text font-heading flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            {t('customer.profile.notifications')}
          </h2>

          <CustomSelect
            label={t('customer.profile.notificationPref')}
            value={profile.notificationPreference}
            onChange={(val) => {
              updateProfile({ notificationPreference: val as NotificationPreference });
            }}
            options={notificationOptions.map((opt) => ({
              value: opt.value,
              label: t(opt.labelKey),
            }))}
          />

          <p className="text-sm text-muted font-body mt-2">
            {t('customer.profile.notificationDesc')}
          </p>
        </div>

        {/* Linked Branches Section */}
        {profile.linkedBranches && profile.linkedBranches.length > 0 && (
          <div className="bg-surface rounded-xl border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-text font-heading flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-primary" />
              {t('customer.profile.linkedBranches')}
            </h2>

            <p className="text-sm text-muted font-body mb-4">
              {t('customer.profile.linkedBranchesDesc')}
            </p>

            <div className="space-y-3">
              {profile.linkedBranches.map((branch) => (
                <div
                  key={branch.id}
                  className="bg-background rounded-lg p-4 border border-border flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-medium text-text font-heading">{branch.name}</h4>
                    <p className="text-sm text-muted font-body">{branch.companyName}</p>
                  </div>
                  <span className="text-xs text-muted font-body">
                    {t('customer.profile.linkedSince')} {formatDate(branch.linkedAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-text font-heading mb-4">
            {t('customer.profile.account')}
          </h2>
          <Button variant="danger" onClick={handleLogout}>
            {t('customer.profile.logout')}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default CustomerProfilePage;
