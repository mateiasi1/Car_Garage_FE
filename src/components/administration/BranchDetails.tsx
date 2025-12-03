import { FC, useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useFetchBranchQuery } from '../../rtk/services/branch-service';
import { useFetchCompanyBranchesQuery } from '../../rtk/services/company-service';
import { useSwitchBranchMutation } from '../../rtk/services/user-service';
import Drawer from '../shared/Drawer';
import { showToast } from '../../utils/showToast';
import { Branch } from '../../models/Branch';
import { AuthContext } from '../../contexts/authContext';
import { Role } from '../../utils/enums/Role';
import { CustomSelect } from '../shared/CustomSelect';
import { ArrowLeftRight, Building, Store, Pencil } from 'lucide-react';
import { Button } from '../shared/Button';
import { PageHeader } from '../shared/PageHeader';
import BranchForm from '../forms/BranchForm';
import { IconButton } from '../shared/IconButton';
import { useDemo } from '../../hooks/useDemo';

const BranchDetails: FC = () => {
  const { t } = useTranslation();
  const [switchDrawerOpen, setSwitchDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const { data: branch, error, isLoading } = useFetchBranchQuery();
  const { data: branches = [] } = useFetchCompanyBranchesQuery();
  const [switchBranch, { isLoading: isSwitching }] = useSwitchBranchMutation();

  const { user, login } = useContext(AuthContext);
  const isOwner = user?.roles?.some((r) => r.name === Role.owner);
  const { isDemo } = useDemo();

  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  useEffect(() => {
    if (switchDrawerOpen && branch?.id) {
      setSelectedBranchId(branch.id);
    }
  }, [switchDrawerOpen, branch?.id]);

  const handleSwitchBranch = async () => {
    if (!selectedBranchId) {
      showToast(t('branch.selectBranch'), 'error');
      return;
    }

    try {
      const result = await switchBranch({ branchId: selectedBranchId }).unwrap();

      if (result.accessToken) {
        login({ accessToken: result.accessToken });

        showToast(t('branch.branchSwitchedSuccessfully'), 'success');
        setSwitchDrawerOpen(false);

        window.location.reload();
      }
    } catch {
      showToast(t('branch.errorSwitchingBranch'), 'error');
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-text font-body">{t('branch.loading')}</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-error font-body">{t('branch.error')}</p>
      </div>
    );

  if (!branch)
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-text font-body">{t('branch.noData')}</p>
      </div>
    );

  const locationParts = [branch.cityRef?.name, branch.cityRef?.county?.name].filter(Boolean).join(', ');

  const rows = [
    { label: t('branch.name'), value: branch.name },
    { label: t('phoneNumber'), value: branch.phoneNumber },
    { label: t('adminBranches.location'), value: locationParts },
    branch.street && { label: t('street'), value: branch.street },
    branch.streetNumber && { label: t('streetNumber'), value: branch.streetNumber },
    branch.houseNumber && { label: t('houseNumber'), value: branch.houseNumber },
    branch.zipcode && { label: t('zipcode'), value: branch.zipcode },
  ].filter(Boolean) as { label: string; value: string | number }[];

  const activePackage = branch.activePackage;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <PageHeader
          title={t('branch.data')}
          icon={Building}
          action={
            <div className="flex items-center gap-3">
              {(isOwner || isDemo) && (
                <IconButton
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => !isDemo && setEditDrawerOpen(true)}
                  className="flex items-center gap-2"
                  disabled={isDemo}
                  title={isDemo ? t('demo.featureDisabled') : undefined}
                >
                  <Pencil className="w-4 h-4" />
                </IconButton>
              )}

              {(branches.length > 1 || isDemo) && (
                <IconButton
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => !isDemo && setSwitchDrawerOpen(true)}
                  className="flex items-center gap-2"
                  disabled={isDemo}
                  title={isDemo ? t('demo.featureDisabled') : undefined}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </IconButton>
              )}
            </div>
          }
        />
      </div>

      <div className="p-4 sm:p-5 lg:p-6">
        {rows.map((row, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-none">
            <span className="text-sm text-muted font-body">{row.label}</span>
            <span className="text-text font-body font-medium">{row.value}</span>
          </div>
        ))}
      </div>

      {(isOwner || isDemo) && (
        <div className="space-y-4">
          <PageHeader title={t('packages.activePackage')} icon={Store} />

          <div className="p-4 sm:p-5 lg:p-6">
            {activePackage ? (
              <>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-sm text-muted font-body">{t('packages.packageName')}</span>
                  <span className="text-text font-heading font-semibold">{activePackage.package?.name || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-sm text-muted font-body">{t('packages.totalMessages')}</span>
                  <span className="text-text font-heading font-semibold">
                    {activePackage.usage?.sms?.limit === -1
                      ? t('packages.unlimited')
                      : activePackage.usage?.sms?.limit || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-sm text-muted font-body">{t('packages.usedMessages')}</span>
                  <span className="text-text font-heading font-semibold">{activePackage.usage?.sms?.used || 0}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border last:border-none">
                  <span className="text-sm text-muted font-body">{t('packages.expiryDate')}</span>
                  <span className="text-text font-heading font-semibold">
                    {activePackage.expiringAt
                      ? new Date(activePackage.expiringAt).toLocaleDateString('ro-RO', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })
                      : t('packages.notSet')}
                  </span>
                </div>
              </>
            ) : (
              <Link
                to="/packages"
                className="inline-flex items-center gap-2 px-4 py-3 bg-primary text-primary-text font-heading font-semibold rounded-lg hover:bg-primary-hover transition"
              >
                <Store className="w-5 h-5" />
                {t('packages.viewAllPackages')}
              </Link>
            )}
          </div>
        </div>
      )}

      <Drawer isOpen={switchDrawerOpen} onClose={() => setSwitchDrawerOpen(false)} title={t('branch.switchBranch')}>
        <div className="space-y-6">
          <CustomSelect
            label={t('branch.selectBranch')}
            value={selectedBranchId}
            onChange={setSelectedBranchId}
            options={branches.map((b: Branch) => ({
              value: b.id,
              label: `${b.name} – ${b.cityRef?.name || ''}`,
            }))}
          />
          <Button
            type="button"
            variant="primary"
            size="md"
            loading={isSwitching}
            disabled={!selectedBranchId}
            className="w-full"
            onClick={handleSwitchBranch}
          >
            {t('branch.confirm')}
          </Button>
        </div>
      </Drawer>

      {(isOwner || isDemo) && (
        <Drawer isOpen={editDrawerOpen} onClose={() => setEditDrawerOpen(false)} title={t('adminBranches.editBranch')}>
          <BranchForm
            key={branch?.id || 'edit'}
            selectedBranch={branch}
            companyId={branch.companyId}
            onCloseDrawer={() => setEditDrawerOpen(false)}
          />
        </Drawer>
      )}
    </div>
  );
};

export default BranchDetails;
