import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    useFetchCompanyBranchesQuery,
} from '../../rtk/services/branch-service';
import { Branch } from '../../models/Branch';
import Drawer from '../shared/Drawer';
import { PersonItemBase } from '../shared/PersonItem';
import { PersonList } from '../shared/PersonList';
import BranchForm from './BranchForm';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/authContext';

interface BranchListItem extends PersonItemBase {
    id: string;
    name: string;
    phoneNumber: string;
    country: string;
    city: string;
    street: string;
    streetNumber?: string;
    houseNumber?: string;
}

const BranchesPage: FC = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);

    const { data: branches, error, isLoading } = useFetchCompanyBranchesQuery();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

    if (isLoading) return <p>Loading branches...</p>;
    if (error) return <p>Failed to load branches</p>;

    const items: BranchListItem[] =
        branches?.map((branch) => ({
            id: branch.id,
            firstName: branch.name, // pentru PersonList
            lastName: '',
            name: branch.name,
            email: branch.email ?? '',
            phoneNumber: branch.phoneNumber ?? '',
            country: branch.country,
            city: branch.city,
            street: branch.street,
            streetNumber: branch.streetNumber,
            houseNumber: branch.houseNumber,
        })) ?? [];

    const handleClick = (item: BranchListItem) => {
        const branch = branches?.find((b) => b.id === item.id) ?? null;
        setSelectedBranch(branch);
        setDrawerOpen(true);
    };

    const handleAdd = () => {
        setSelectedBranch(null);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedBranch(null);
    };

    // Admin + Owner pot vedea pagina; logica de “cine ajunge aici” e în routing/menu.
    const canManageBranches =
        user?.roles?.some((r) => r.name === 'Admin' || r.name === 'Owner') ?? false;

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] pb-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-heading">{t('branches.branches')}</h2>

                {canManageBranches && (
                    <button
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
                        onClick={handleAdd}
                    >
                        {t('branches.addBranch')}
                    </button>
                )}
            </div>

            <PersonList items={items} onItemClick={canManageBranches ? handleClick : undefined} />

            <Drawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                title={selectedBranch ? t('branches.editBranch') : t('branches.addBranch')}
            >
                <BranchForm selectedBranch={selectedBranch} onCloseDrawer={handleCloseDrawer} />
            </Drawer>
        </div>
    );
};

export default BranchesPage;
