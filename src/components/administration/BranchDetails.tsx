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

const BranchDetails: FC = () => {
  const { t } = useTranslation();
  const [switchDrawerOpen, setSwitchDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const { data: branch, error, isLoading } = useFetchBranchQuery();
  const { data: branches = [] } = useFetchCompanyBranchesQuery();
  const [switchBranch, { isLoading: isSwitching }] = useSwitchBranchMutation();

  const { user, login } = useContext(AuthContext);
  const isOwner = user?.roles?.some((r) => r.name === Role.owner);

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

  const rows = [
    { label: t('branch.name'), value: branch.name },
    { label: t('branch.country'), value: branch.country },
    { label: t('branch.city'), value: branch.city },
    branch.zipcode && { label: t('branch.zipcode'), value: branch.zipcode },
    { label: t('branch.street'), value: branch.street },
    branch.streetNumber && { label: t('branch.streetNumber'), value: branch.streetNumber },
    branch.houseNumber && { label: t('branch.houseNumber'), value: branch.houseNumber },
    branch.phoneNumber && { label: t('branch.phoneNumber'), value: branch.phoneNumber },
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
              {isOwner && (
                <IconButton
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setEditDrawerOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                </IconButton>
              )}

              {branches.length > 1 && (
                <IconButton
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => setSwitchDrawerOpen(true)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </IconButton>
              )}
            </div>
          }
        />
      </div>

      <div className="mt-0 p-4 sm:p-5 lg:p-6 w-full rounded-2xl bg-white">
        {rows.map((row, index) => (
          <div key={index} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-none">
            <span className="text-sm text-text/60 font-body">{row.label}</span>
            <span className="text-text font-body">{row.value}</span>
          </div>
        ))}
      </div>

      {isOwner && (
        <div className="space-y-4">
          <PageHeader title={t('packages.activePackage')} icon={Store} />

          <div className="p-4 sm:p-5 lg:p-6 w-full rounded-2xl bg-white">
            {activePackage ? (
              <>
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <span className="text-sm text-text/60">{t('packages.packageName')}</span>
                  <span className="text-text font-heading font-semibold">{activePackage.package?.name || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <span className="text-sm text-text/60">{t('packages.totalMessages')}</span>
                  <span className="text-text font-heading font-semibold">
                    {activePackage.usage?.sms?.limit === -1
                      ? t('packages.unlimited')
                      : activePackage.usage?.sms?.limit || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <span className="text-sm text-text/60">{t('packages.usedMessages')}</span>
                  <span className="text-text font-heading font-semibold">{activePackage.usage?.sms?.used || 0}</span>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-none">
                  <span className="text-sm text-text/60">{t('packages.expiryDate')}</span>
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
                className="block text-center px-4 py-3 bg-primary text-primary-text font-heading font-semibold rounded-xl hover:bg-primary-hover transition"
              >
                <Store className="w-6 h-6 text-primary" />
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
              label: `${b.name} – ${b.city}`,
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

      {isOwner && (
        <Drawer isOpen={editDrawerOpen} onClose={() => setEditDrawerOpen(false)} title={t('branch.editBranch')}>
          <BranchForm
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
