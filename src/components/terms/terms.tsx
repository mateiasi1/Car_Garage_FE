import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link to="/" className="flex items-center space-x-2 w-fit">
                        <i className="fas fa-car text-2xl text-primary"></i>
                        <span className="text-xl font-bold font-heading text-text">RoadReady</span>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-card rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold font-heading text-text mb-2">
                        {t('terms.title')}
                    </h1>
                    <p className="text-sm text-gray-500 font-body mb-8">
                        {t('terms.lastUpdated')}: {new Date().toLocaleDateString('ro-RO')}
                    </p>

                    {/* Introduction */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold font-heading text-text mb-4">
                            {t('terms.sections.intro.title')}
                        </h2>
                        <p className="text-gray-700 font-body mb-4">
                            {t('terms.sections.intro.content.p1')}
                        </p>
                        <p className="text-gray-700 font-body">
                            {t('terms.sections.intro.content.p2')}
                        </p>
                    </section>

                    {/* Service Description */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold font-heading text-text mb-4">
                            {t('terms.sections.service.title')}
                        </h2>
                        <p className="text-gray-700 font-body mb-4">
                            {t('terms.sections.service.content.p1')}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 font-body ml-4">
                            <li>{t('terms.sections.service.content.features.f1')}</li>
                            <li>{t('terms.sections.service.content.features.f2')}</li>
                            <li>{t('terms.sections.service.content.features.f3')}</li>
                            <li>{t('terms.sections.service.content.features.f4')}</li>
                        </ul>
                    </section>

                    {/* Data Collection */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold font-heading text-text mb-4">
                            {t('terms.sections.data.title')}
                        </h2>
                        <p className="text-gray-700 font-body mb-4">
                            {t('terms.sections.data.content.p1')}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 font-body ml-4 mb-4">
                            <li>{t('terms.sections.data.content.types.t1')}</li>
                            <li>{t('terms.sections.data.content.types.t2')}</li>
                            <li>{t('terms.sections.data.content.types.t3')}</li>
                            <li>{t('terms.sections.data.content.types.t4')}</li>
                        </ul>
                        <p className="text-gray-700 font-body">
                            {t('terms.sections.data.content.p2')}
                        </p>
                    </section>

                    {/* GDPR Compliance */}
                    <section className="mb-8 bg-blue-50 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold font-heading text-text mb-4">
                            <i className="fas fa-shield-alt text-primary mr-2"></i>
                            {t('terms.sections.gdpr.title')}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold font-heading text-text mb-2">
                                    {t('terms.sections.gdpr.rights.title')}
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700 font-body ml-4">
                                    <li>{t('terms.sections.gdpr.rights.r1')}</li>
                                    <li>{t('terms.sections.gdpr.rights.r2')}</li>
                                    <li>{t('terms.sections.gdpr.rights.r3')}</li>
                                    <li>{t('terms.sections.gdpr.rights.r4')}</li>
                                    <li>{t('terms.sections.gdpr.rights.r5')}</li>
                                    <li>{t('terms.sections.gdpr.rights.r6')}</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold font-heading text-text mb-2">
                                    {t('terms.sections.gdpr.legal.title')}
                                </h3>
                                <p className="text-gray-700 font-body">
                                    {t('terms.sections.gdpr.legal.content')}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold font-heading text-text mb-2">
                                    {t('terms.sections.gdpr.retention.title')}
                                </h3>
                                <p className="text-gray-700 font-body">
                                    {t('terms.sections.gdpr.retention.content')}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold font-heading text-text mb-2">
                                    {t('terms.sections.gdpr.security.title')}
                                </h3>
                                <p className="text-gray-700 font-body">
                                    {t('terms.sections.gdpr.security.content')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Data Security */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold font-heading text-text mb-4">
                            {t('terms.sections.security.title')}
                        </h2>
                        <p className="text-gray-700 font-body mb-4">
                            {t('terms.sections.security.content.p1')}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 font-body ml-4">
                            <li>{t('terms.sections.security.content.measures.m1')}</li>
                            <li>{t('terms.sections.security.content.measures.m2')}</li>
                            <li>{t('terms.sections.security.content.measures.m3')}</li>
                            <li>{t('terms.sections.security.content.measures.m4')}</li>
                        </ul>
                    </section>

                    {/* User Responsibilities */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold font-heading text-text mb-4">
                            {t('terms.sections.responsibilities.title')}
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 font-body ml-4">
                            <li>{t('terms.sections.responsibilities.content.r1')}</li>
                            <li>{t('terms.sections.responsibilities.content.r2')}</li>
                            <li>{t('terms.sections.responsibilities.content.r3')}</li>
                            <li>{t('terms.sections.responsibilities.content.r4')}</li>
                            <li>{t('terms.sections.responsibilities.content.r5')}</li>
                        </ul>
                    </section>

                    {/* Liability */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold font-heading text-text mb-4">
                            {t('terms.sections.liability.title')}
                        </h2>
                        <p className="text-gray-700 font-body">
                            {t('terms.sections.liability.content')}
                        </p>
                    </section>

                    {/* Changes to Terms */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold font-heading text-text mb-4">
                            {t('terms.sections.changes.title')}
                        </h2>
                        <p className="text-gray-700 font-body">
                            {t('terms.sections.changes.content')}
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="mb-8 bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold font-heading text-text mb-4">
                            {t('terms.sections.contact.title')}
                        </h2>
                        <p className="text-gray-700 font-body mb-4">
                            {t('terms.sections.contact.content')}
                        </p>
                        <div className="space-y-2 text-gray-700 font-body">
                            <p>
                                <i className="fas fa-envelope text-primary mr-2"></i>
                                <strong>{t('terms.sections.contact.email')}:</strong> contact@roadready.ro
                            </p>
                            <p>
                                <i className="fas fa-map-marker-alt text-primary mr-2"></i>
                                <strong>{t('terms.sections.contact.address')}:</strong> Craiova, Dolj, România
                            </p>
                        </div>
                    </section>

                    {/* Agreement */}
                    <div className="border-t-2 border-gray-200 pt-6">
                        <p className="text-gray-700 font-body font-semibold">
                            {t('terms.agreement')}
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-card border-t border-gray-200 mt-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600 font-body">
                    <Link to="/" className="hover:text-primary transition-colors">
                        {t('terms.backToHome')}
                    </Link>
                </div>
            </footer>
        </div>
    );
};

export default TermsAndConditions;