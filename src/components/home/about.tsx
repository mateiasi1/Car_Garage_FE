import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/authContext';
import { routes } from '../../constants/routes';
import logo from '../../assets/logo.png';
// import carHome from '../../assets/car_home.png';

const About = () => {
    const { t } = useTranslation();
    const { isAuthenticated } = useContext(AuthContext);

    const primaryCtaLink = isAuthenticated ? routes.ADMINISTRATION : routes.LOGIN;
    const primaryCtaLabel = isAuthenticated
        ? t('home.adminButton')
        : t('home.loginButton');

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-primary to-sidebar text-primary-text flex flex-col">
            <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <img
                            src={logo}
                            alt="RoadReady Logo"
                            className="h-10 w-10 rounded-md shadow-md"
                        />
                        <span className="text-xl sm:text-2xl font-bold font-heading tracking-tight text-primary">
                          RoadReady
                        </span>
                    </div>

                    <Link
                        to={primaryCtaLink}
                        className="px-5 py-2 bg-primary text-primary-text rounded-full hover:bg-primary-hover transition-colors font-body text-sm sm:text-base shadow-md"
                    >
                        {primaryCtaLabel}
                    </Link>
                </div>
            </header>

            <main className="flex-1">
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left space-y-6">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary drop-shadow-sm">
                                {t('home.hero.title')}
                            </h1>

                            <p className="text-base sm:text-lg text-primary/90 max-w-lg mx-auto lg:mx-0 font-body leading-relaxed">
                                {t('home.hero.subtitle')}
                            </p>

                            <div className="flex justify-center lg:justify-start">
                                <Link
                                    to={primaryCtaLink}
                                    className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-text text-base font-semibold font-heading rounded-full hover:bg-primary-hover transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    {t('home.hero.cta')}
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center justify-center relative">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-3xl bg-primary/30 blur-3xl animate-pulse" />

                                <div className="relative bg-card/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 flex items-center justify-center">
                                    <img
                                        src={logo}
                                        alt="RoadReady Logo"
                                        className="w-40 h-40 animate-[pulse_2.5s_ease-in-out_infinite]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        <div className="bg-card rounded-3xl shadow-md p-6 flex flex-col gap-3 hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <i className="fas fa-building text-primary" />
                            </div>
                            <h3 className="text-lg font-heading font-semibold text-text">
                                {t('home.features.stations.title')}
                            </h3>
                            <p className="text-sm text-gray-600 font-body">
                                {t('home.features.stations.description')}
                            </p>
                        </div>

                        <div className="bg-card rounded-3xl shadow-md p-6 flex flex-col gap-3 hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <i className="fas fa-clipboard-check text-primary" />
                            </div>
                            <h3 className="text-lg font-heading font-semibold text-text">
                                {t('home.features.inspections.title')}
                            </h3>
                            <p className="text-sm text-gray-600 font-body">
                                {t('home.features.inspections.description')}
                            </p>
                        </div>

                        <div className="bg-card rounded-3xl shadow-md p-6 flex flex-col gap-3 hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <i className="fas fa-bell text-primary" />
                            </div>
                            <h3 className="text-lg font-heading font-semibold text-text">
                                {t('home.features.notifications.title')}
                            </h3>
                            <p className="text-sm text-gray-600 font-body">
                                {t('home.features.notifications.description')}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="bg-primary rounded-3xl shadow-2xl px-6 sm:px-10 py-8 sm:py-10 text-primary-text text-center relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-activeMenu/30 blur-2xl" />
                        <div className="absolute bottom-[-3rem] left-[-3rem] h-32 w-32 rounded-full bg-background/40 blur-2xl" />

                        <div className="relative">
                            <h3 className="text-2xl sm:text-3xl font-heading font-bold mb-3">
                                {t('home.contact.title')}
                            </h3>
                            <p className="text-base sm:text-lg mb-6 opacity-90 font-body max-w-2xl mx-auto">
                                {t('home.contact.description')}
                            </p>
                            <a
                                href="mailto:contact@roadready.ro"
                                className="inline-flex items-center justify-center px-7 py-3 bg-card text-primary font-semibold font-heading rounded-full hover:bg-background transition-colors shadow-lg text-sm sm:text-base"
                            >
                                <i className="fas fa-envelope mr-2" />
                                {t('home.contact.button')}
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-card/95 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 font-body text-sm sm:text-base">
                    <div className="text-center md:text-left">
                        © 2025 RoadReady. {t('home.footer.rights')}
                    </div>
                    <div className="flex space-x-6">
                        <Link
                            to="/terms"
                            className="hover:text-primary transition-colors"
                        >
                            {t('home.footer.terms')}
                        </Link>
                        <a
                            href="mailto:contact@roadready.ro"
                            className="hover:text-primary transition-colors"
                        >
                            {t('home.footer.contact')}
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default About;
