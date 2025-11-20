import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {useContext} from "react";
import {AuthContext} from "../../contexts/authContext";
import {routes} from "../../constants/routes";
import logo from '../../assets/logo.png';

const About = () => {
    const { t } = useTranslation();
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center">
                            <img src={logo} alt="RoadReady Logo" className="h-14 w-14 mr-3" />
                            <span className="text-2xl font-bold font-heading text-primary">RoadReady</span>
                        </div>
                    </div>
                    <Link
                        to={isAuthenticated ? routes.ADMINISTRATION : routes.LOGIN}
                        className="px-6 py-2 bg-primary text-primary-text rounded-lg hover:bg-primary-hover transition-colors font-body"
                    >
                        {isAuthenticated ? t('home.loginButton') : t('home.adminButton')}
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-text mb-6">
                        {t('home.hero.title')}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 font-body">
                        {t('home.hero.subtitle')}
                    </p>
                    <Link
                        to={isAuthenticated ? routes.ADMINISTRATION : routes.LOGIN}
                        className="inline-block px-8 py-4 bg-primary text-primary-text text-lg font-semibold font-heading rounded-lg hover:bg-primary-hover transition-colors shadow-lg"
                    >
                        {t('home.hero.cta')}
                    </Link>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-primary text-4xl mb-4">
                            <i className="fas fa-building"></i>
                        </div>
                        <h3 className="text-xl font-bold font-heading text-text mb-2">
                            {t('home.features.stations.title')}
                        </h3>
                        <p className="text-gray-600 font-body">
                            {t('home.features.stations.description')}
                        </p>
                    </div>

                    <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-primary text-4xl mb-4">
                            <i className="fas fa-clipboard-check"></i>
                        </div>
                        <h3 className="text-xl font-bold font-heading text-text mb-2">
                            {t('home.features.inspections.title')}
                        </h3>
                        <p className="text-gray-600 font-body">
                            {t('home.features.inspections.description')}
                        </p>
                    </div>

                    <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-primary text-4xl mb-4">
                            <i className="fas fa-bell"></i>
                        </div>
                        <h3 className="text-xl font-bold font-heading text-text mb-2">
                            {t('home.features.notifications.title')}
                        </h3>
                        <p className="text-gray-600 font-body">
                            {t('home.features.notifications.description')}
                        </p>
                    </div>
                </div>

                {/* Contact Card */}
                <div className="bg-sidebar rounded-lg shadow-xl p-8 text-primary-text text-center">
                    <h3 className="text-2xl font-bold font-heading mb-4">
                        {t('home.contact.title')}
                    </h3>
                    <p className="text-lg mb-6 opacity-90 font-body">
                        {t('home.contact.description')}
                    </p>
                    <a
                        href="mailto:contact@roadready.ro"
                        className="inline-block px-8 py-3 bg-primary text-primary-text font-semibold font-heading rounded-lg hover:bg-primary-hover transition-colors"
                    >
                        <i className="fas fa-envelope mr-2"></i>
                        {t('home.contact.button')}
                    </a>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-card border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-gray-600 font-body">
                            © 2025 RoadReady. {t('home.footer.rights')}
                        </div>
                        <div className="flex space-x-6">
                            <Link
                                to="/terms"
                                className="text-gray-600 hover:text-primary transition-colors font-body"
                            >
                                {t('home.footer.terms')}
                            </Link>
                            <a
                                href="mailto:contact@roadready.ro"
                                className="text-gray-600 hover:text-primary transition-colors font-body"
                            >
                                {t('home.footer.contact')}
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default About;