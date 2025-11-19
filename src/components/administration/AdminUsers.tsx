import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import { useFetchCompanyUsersQuery } from '../../rtk/services/admin-service';
// import GenericTable, { TableColumn, TableAction } from '../shared/GenericTable';

const AdminUsers: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const companyId = searchParams.get('companyId');

    // Redirect if no companyId
    useEffect(() => {
        if (!companyId) {
            navigate('/administration/companies', { replace: true });
        }
    }, [companyId, navigate]);

    // If no companyId, don't render anything (will redirect)
    if (!companyId) {
        return null;
    }

    // TODO: Fetch users for this company
    // const { data: users, isLoading } = useFetchCompanyUsersQuery(companyId);

    return (
        <div className="space-y-6">
            {/* Header with back button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/administration/companies')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <i className="fas fa-arrow-left"></i>
                    <span>{t('back')}</span>
                </button>
                <h2 className="text-2xl font-bold">{t('adminCompanies.companyUsers')}</h2>
            </div>

            {/* Company info */}
            <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                    {t('adminCompanies.viewingUsersFor')}: <span className="font-semibold">{companyId}</span>
                </p>
            </div>

            {/* TODO: Add GenericTable with users */}
            <div className="text-center p-8 text-gray-500">
                <p>{t('adminCompanies.usersListComingSoon')}</p>
            </div>
        </div>
    );
};

export default AdminUsers;