import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Percent, Trash2 } from 'lucide-react';

import { useFetchAdminCompaniesQuery, useFetchAdminCompanyBranchesQuery } from '../../../rtk/services/admin-service';
import { useFetchPackagesQuery } from '../../../rtk/services/package-service';
import {
  useCreateDiscountMutation,
  useFetchAllDiscountsQuery,
  useDeleteDiscountMutation,
  DiscountResponse,
} from '../../../rtk/services/discount-service';
import { CustomSelect } from '../../shared/CustomSelect';
import { CustomInput } from '../../shared/CustomInput';
import { CustomDatePicker } from '../../shared/CustomDatePicker';
import { Button } from '../../shared/Button';
import { PageHeader } from '../../shared/PageHeader';
import DropdownMultiSelect from '../../shared/DropdownMultiSelect';
import { showToast } from '../../../utils/showToast';

const AdminDiscounts: FC = () => {
  const { t } = useTranslation();

  // Form state
  const [allCompanies, setAllCompanies] = useState<boolean>(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([]);
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [allBranches, setAllBranches] = useState<boolean>(false);
  const [allPackages, setAllPackages] = useState<boolean>(false);
  const [discountPercentage, setDiscountPercentage] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // API queries
  const { data: companies = [] } = useFetchAdminCompaniesQuery();
  const { data: branches = [], isLoading: isLoadingBranches } = useFetchAdminCompanyBranchesQuery(selectedCompanyId, {
    skip: !selectedCompanyId,
  });
  const { data: packages = [], isLoading: isLoadingPackages } = useFetchPackagesQuery();
  const { data: discounts = [], isLoading: isLoadingDiscounts } = useFetchAllDiscountsQuery();

  // Mutations
  const [createDiscount, { isLoading: isCreating }] = useCreateDiscountMutation();
  const [deleteDiscount, { isLoading: isDeleting }] = useDeleteDiscountMutation();

  // Reset branches when company changes
  useEffect(() => {
    setSelectedBranchIds([]);
    setAllBranches(false);
  }, [selectedCompanyId]);

  const handleAllCompaniesChange = (checked: boolean) => {
    setAllCompanies(checked);
    if (checked) {
      setSelectedCompanyId('');
      setSelectedBranchIds([]);
      setAllBranches(true); // When all companies, must be all branches too
    }
  };

  const handleAllBranchesChange = (checked: boolean) => {
    setAllBranches(checked);
    if (checked) {
      setSelectedBranchIds([]);
    }
  };

  const handleAllPackagesChange = (checked: boolean) => {
    setAllPackages(checked);
    if (checked) {
      setSelectedPackageIds([]);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!allCompanies && !selectedCompanyId) {
      newErrors.company = t('discounts.companyRequired');
    }

    if (!allCompanies && !allBranches && selectedBranchIds.length === 0) {
      newErrors.branches = t('discounts.branchRequired');
    }

    if (!allPackages && selectedPackageIds.length === 0) {
      newErrors.packages = t('discounts.packageRequired');
    }

    const discount = parseFloat(discountPercentage);
    if (!discountPercentage || isNaN(discount)) {
      newErrors.discount = t('discounts.discountRequired');
    } else if (discount < 0 || discount > 100) {
      newErrors.discount = t('discounts.discountRange');
    }

    if (!expiresAt) {
      newErrors.expiresAt = t('discounts.expiresAtRequired');
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expiresAt <= today) {
        newErrors.expiresAt = t('discounts.expiresAtFuture');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await createDiscount({
        companyId: allCompanies ? null : selectedCompanyId,
        branchIds: allCompanies || allBranches ? null : selectedBranchIds,
        packageIds: allPackages ? null : selectedPackageIds,
        discountPercentage: parseFloat(discountPercentage),
        expiresAt: expiresAt ? expiresAt.toISOString().split('T')[0] : null,
      }).unwrap();

      showToast(t('discounts.discountCreated'), 'success');
      handleReset();
    } catch (error) {
      showToast(t('discounts.discountCreateError'), 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDiscount(id).unwrap();
      showToast(t('discounts.discountDeleted'), 'success');
    } catch (error) {
      showToast(t('discounts.discountDeleteError'), 'error');
    }
  };

  const handleReset = () => {
    setAllCompanies(false);
    setSelectedCompanyId('');
    setSelectedBranchIds([]);
    setSelectedPackageIds([]);
    setAllBranches(false);
    setAllPackages(false);
    setDiscountPercentage('');
    setExpiresAt(null);
    setErrors({});
  };

  const companyOptions = companies.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const formatDiscountScope = (discount: DiscountResponse): string => {
    const parts: string[] = [];

    if (discount.company) {
      parts.push(discount.company.name);
    } else {
      parts.push(t('discounts.allCompaniesLabel'));
    }

    if (discount.branch) {
      parts.push(discount.branch.name);
    } else {
      parts.push(t('discounts.allBranchesLabel'));
    }

    if (discount.package) {
      parts.push(discount.package.name);
    } else {
      parts.push(t('discounts.allPackagesLabel'));
    }

    return parts.join(' → ');
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={t('discounts.title')} icon={Percent} />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-text mb-4">{t('discounts.createNew')}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Companies Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allCompanies"
                    checked={allCompanies}
                    onChange={(e) => handleAllCompaniesChange(e.target.checked)}
                    className="w-4 h-4 rounded border-text/30 text-primary focus:ring-primary"
                  />
                  <label htmlFor="allCompanies" className="text-sm font-semibold font-body text-text">
                    {t('discounts.allCompanies')}
                  </label>
                </div>

            {!allCompanies && (
              <CustomSelect
                label={t('discounts.selectCompany')}
                value={selectedCompanyId}
                onChange={setSelectedCompanyId}
                options={[{ value: '', label: t('discounts.chooseCompany') }, ...companyOptions]}
                error={errors.company}
              />
            )}
              </div>

              {/* Branches Section */}
              {!allCompanies && selectedCompanyId && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="allBranches"
                      checked={allBranches}
                      onChange={(e) => handleAllBranchesChange(e.target.checked)}
                      className="w-4 h-4 rounded border-text/30 text-primary focus:ring-primary"
                    />
                    <label htmlFor="allBranches" className="text-sm font-semibold font-body text-text">
                      {t('discounts.allBranches')}
                    </label>
                  </div>

                  {!allBranches && (
                    <DropdownMultiSelect
                      label={t('discounts.selectBranches')}
                      options={branches}
                      selectedIds={selectedBranchIds}
                      onSelectionChange={setSelectedBranchIds}
                      getOptionId={(branch) => branch.id}
                      getOptionLabel={(branch) => branch.name}
                      placeholder={t('discounts.chooseBranches')}
                      emptyMessage={t('discounts.noBranches')}
                      selectedCountMessage={(count) => `${count} ${t('discounts.branchesSelected')}`}
                      disabled={isLoadingBranches}
                      error={errors.branches}
                    />
                  )}
                </div>
              )}

              {/* Packages Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allPackages"
                    checked={allPackages}
                    onChange={(e) => handleAllPackagesChange(e.target.checked)}
                    className="w-4 h-4 rounded border-text/30 text-primary focus:ring-primary"
                  />
                  <label htmlFor="allPackages" className="text-sm font-semibold font-body text-text">
                    {t('discounts.allPackages')}
                  </label>
                </div>

                {!allPackages && (
                  <DropdownMultiSelect
                    label={t('discounts.selectPackages')}
                    options={packages}
                    selectedIds={selectedPackageIds}
                    onSelectionChange={setSelectedPackageIds}
                    getOptionId={(pkg) => pkg.id}
                    getOptionLabel={(pkg) => pkg.name}
                    placeholder={t('discounts.choosePackages')}
                    emptyMessage={t('discounts.noPackages')}
                    selectedCountMessage={(count) => `${count} ${t('discounts.packagesSelected')}`}
                    disabled={isLoadingPackages}
                    error={errors.packages}
                  />
                )}
              </div>

              {/* Discount Percentage */}
              <CustomInput
                label={t('discounts.discountPercentage')}
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={discountPercentage}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (e.target.value === '' || (value >= 0 && value <= 100)) {
                    setDiscountPercentage(e.target.value);
                  }
                }}
                placeholder="e.g., 15"
                error={errors.discount}
              />

              {/* Expiry Date */}
              <CustomDatePicker
                label={t('discounts.expiresAt')}
                selected={expiresAt}
                onChange={(date) => setExpiresAt(date)}
                minDate={new Date()}
                placeholder={t('discounts.selectExpiryDate')}
                error={errors.expiresAt}
              />

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary" fullWidth={false} disabled={isCreating}>
                  {isCreating ? t('loading') : t('discounts.saveDiscount')}
                </Button>
                <Button type="button" variant="secondary" fullWidth={false} onClick={handleReset}>
                  {t('discounts.reset')}
                </Button>
              </div>
            </form>
          </div>

          {/* Existing Discounts Section */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-text mb-4">{t('discounts.existingDiscounts')}</h3>
            {isLoadingDiscounts ? (
              <p className="text-text/50">{t('loading')}</p>
            ) : discounts.length === 0 ? (
              <p className="text-text/50">{t('discounts.noDiscounts')}</p>
            ) : (
              <div className="space-y-3">
                {discounts.map((discount) => (
                  <div
                    key={discount.id}
                    className="bg-card rounded-xl p-4 border border-text/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text font-medium truncate">{formatDiscountScope(discount)}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-lg font-bold text-primary">{discount.discountPercentage}%</span>
                        {discount.expiresAt && (
                          <span className="text-xs text-text/50">
                            {t('discounts.expiresLabel')} {new Date(discount.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(discount.id)}
                      disabled={isDeleting}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDiscounts;
