import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchCompanyQuery } from '../../rtk/services/company-service';
import { Building2 } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import Drawer from '../shared/Drawer';
import { Button } from '../shared/Button';
import BranchForm from '../forms/BranchForm';

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
    { label: t('country'), value: company.country },
    { label: t('city'), value: company.city },
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
            <Button type="button" variant="primary" size="md" onClick={() => setCreateBranchOpen(true)}>
              {t('adminBranches.addBranch')}
            </Button>
          }
        />
      </div>

      <div className="p-4 sm:p-5 lg:p-6 divide-y divide-gray-200 border-t border-gray-200">
        {rows.map((row, idx) => (
          <div key={idx} className="flex items-center justify-between py-4">
            <span className="text-text/70 font-body">{row.label}</span>
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
