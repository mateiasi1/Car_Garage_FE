import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchCompanyQuery } from '../../rtk/services/company-service';
import { Building2, Plus } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import Drawer from '../shared/Drawer';
import BranchForm from '../forms/BranchForm';
import { IconButton } from '../shared/IconButton';

interface Row {
  label: string;
  value: string;
}

const CompanyDetails: FC = () => {
  const { data: company, error, isLoading } = useFetchCompanyQuery();
  const { t } = useTranslation();
  const [createBranchOpen, setCreateBranchOpen] = useState(false);

  if (isLoading) return <div className="p-8 text-text font-body">{t('company.loading')}</div>;

  if (error) return <div className="p-8 text-error font-body">{t('company.error')}</div>;

  if (!company) return <div className="p-8 text-text font-body">{t('company.noData')}</div>;

  const rows: Row[] = [
    { label: t('name'), value: company.name },
    { label: t('shortName'), value: company.shortName },
    company.cityRef?.county && { label: t('county'), value: company.cityRef.county.name },
    company.cityRef && { label: t('city'), value: company.cityRef.name },
    company.zipcode && { label: t('zipcode'), value: company.zipcode },
    { label: t('street'), value: company.street },
    company.streetNumber && { label: t('streetNumber'), value: company.streetNumber },
    company.houseNumber && { label: t('houseNumber'), value: company.houseNumber },
    company.phoneNumber && { label: t('phoneNumber'), value: company.phoneNumber },
  ].filter((x): x is Row => Boolean(x));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <PageHeader
          title={t('companyData')}
          icon={Building2}
          action={
            <IconButton type="button" variant="primary" size="md" onClick={() => setCreateBranchOpen(true)}>
              <Plus className="w-4 h-4" />
            </IconButton>
          }
        />
      </div>

      <div className="p-4 sm:p-5 lg:p-6">
        {rows.map((row, idx) => (
          <div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-none">
            <span className="text-sm text-muted font-body">{row.label}</span>
            <span className="text-text font-body font-medium">{row.value}</span>
          </div>
        ))}
      </div>

      <Drawer isOpen={createBranchOpen} onClose={() => setCreateBranchOpen(false)} title={t('adminBranches.addBranch')}>
        <BranchForm selectedBranch={null} onCloseDrawer={() => setCreateBranchOpen(false)} isOwnerMode={true} />
      </Drawer>
    </div>
  );
};

export default CompanyDetails;
