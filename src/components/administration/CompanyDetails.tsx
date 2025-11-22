import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchCompanyQuery } from '../../rtk/services/company-service';
import { CustomText } from '../shared/CustomText';
import { Building2 } from 'lucide-react';

interface Row {
  label: string;
  value: string;
}

const CompanyDetails: FC = () => {
  const { data: company, error, isLoading } = useFetchCompanyQuery();
  const { t } = useTranslation();

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
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <CustomText variant="h3" color="primary">
          {t('companyData')}
        </CustomText>
      </div>

      <div className="divide-y divide-gray-200 border-t border-gray-200">
        {rows.map((row, idx) => (
          <div key={idx} className="flex items-center justify-between py-4">
            <span className="text-text/70 font-body">{row.label}</span>
            <span className="text-text font-body font-medium">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyDetails;
