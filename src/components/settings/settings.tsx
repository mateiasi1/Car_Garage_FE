import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const Settings: FC = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center h-screen p-4">
            <h1 className="text-3xl font-semibold mb-8">{t('settings')}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
               <p>TO be determined</p>
            </div>
        </div>
    );
};

export default Settings;
