import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { AuthContext } from '../../contexts/authContext';
import { routes } from '../../constants/routes';
import logo from '../../assets/logo.png';
import carHome from '../../assets/car_home.png';
import { Button } from '../shared/Button';
import { brandName, contactEmail, contactPhone, contactPhoneRaw } from '../../constants/constants';
import { useFetchPublicPackagesQuery } from '../../rtk/services/package-service';
import {
  Building2,
  ClipboardCheck,
  Bell,
  Mail,
  Phone,
  ArrowRight,
  Check,
  Tag,
  MapPin,
  ChevronRight,
  Clock,
  Shield,
  Zap,
  Lock
} from 'lucide-react';

// Simplified animation variant
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Animated wrapper component
const AnimatedDiv = ({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      variants={fadeIn}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const InspectorPage = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useContext(AuthContext);
  const contactRef = useRef<HTMLDivElement>(null);
  const { data: packages, isLoading: packagesLoading, error: packagesError } = useFetchPublicPackagesQuery();

  const primaryCtaLink = isAuthenticated ? routes.ADMINISTRATION : routes.LOGIN;
  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const offerEndDate = new Date(2026, 1, 14, 0, 0, 0);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = offerEndDate.getTime() - now.getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatPrice = (price: number) => new Intl.NumberFormat('en-US').format(price);

  const features = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: t('home.features.stations.title'),
      description: t('home.features.stations.description'),
    },
    {
      icon: <ClipboardCheck className="w-6 h-6" />,
      title: t('home.features.inspections.title'),
      description: t('home.features.inspections.description'),
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: t('home.features.notifications.title'),
      description: t('home.features.notifications.description'),
    },
  ];

  const benefits = [
    { icon: <Zap className="w-5 h-5" />, text: 'Interfață intuitivă și ușor de folosit' },
    { icon: <Bell className="w-5 h-5" />, text: 'Notificări automate pentru clienții tăi' },
    { icon: <ClipboardCheck className="w-5 h-5" />, text: 'Rapoarte detaliate și statistici' },
    { icon: <Shield className="w-5 h-5" />, text: 'Securitate avansată a datelor' },
    { icon: <Clock className="w-5 h-5" />, text: 'Suport tehnic dedicat' },
    { icon: <Check className="w-5 h-5" />, text: 'Actualizări continue' },
  ];

  return (
    <div className="min-h-screen bg-background text-text">
      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to={routes.HOME} className="flex items-center gap-2">
              <img src={logo} alt="RoadReady" className="h-9 w-9 rounded-lg" />
              <span className="text-xl font-bold font-heading text-primary hidden sm:block">RoadReady</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to={routes.HOME}>
                <Button variant="ghost" size="sm" className="text-text/70 hover:text-primary">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline">{t('home.hero.findStation')}</span>
                  <span className="sm:hidden">ITP</span>
                </Button>
              </Link>
              <Link to={primaryCtaLink}>
                <Button variant="primary" size="sm">
                  {t('loginButton')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-background/90 to-background z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/10 z-10" />
          <img
            src={carHome}
            alt=""
            className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity"
          />
        </div>
        {/* Background gradient orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6"
            >
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              {t('home.hero.badge')}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-5 leading-tight"
            >
              <span className="text-text">{t('home.hero.title').split(' ').slice(0, 2).join(' ')}</span>{' '}
              <span className="text-primary">{t('home.hero.title').split(' ').slice(2).join(' ')}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-muted max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              {t('home.hero.subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button
                size="md"
                variant="primary"
                onClick={scrollToContact}
                className="px-6 group"
              >
                {t('home.hero.cta')}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
              <Link to={routes.ADMINISTRATION_SHORT}>
                <Button size="md" variant="secondary" className="px-6 w-full sm:w-auto">
                  <Lock className="w-4 h-4 mr-2" />
                  {t('loginButton')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PACKAGES SECTION */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimatedDiv className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">{t('packages.name')}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-text mt-2 mb-3">
              {t('packages.availablePackages')}
            </h2>
            <p className="text-muted max-w-xl mx-auto">{t('packages.choosePackageDescription')}</p>
          </AnimatedDiv>

          {/* Limited Time Offer */}
          {offerEndDate.getTime() > Date.now() && (
            <AnimatedDiv className="mb-10">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-5 sm:p-6 border border-primary/20">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Tag className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-bold text-primary mb-1">
                        {t('discounts.limitedTimeOffer_Title')}
                      </h3>
                      <p className="text-text/70 text-sm">{t('discounts.limitedTimeOffer_Text')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    {[
                      { value: timeLeft.days, label: t('days') },
                      { value: timeLeft.hours, label: t('hours') },
                      { value: timeLeft.minutes, label: t('min') },
                      { value: timeLeft.seconds, label: t('sec') },
                    ].map((item, i) => (
                      <div key={i} className="bg-surface rounded-lg px-2.5 py-1.5 text-center min-w-[50px] border border-border/50">
                        <div className="text-lg sm:text-xl font-bold text-primary">{item.value}</div>
                        <div className="text-[10px] text-muted uppercase">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-primary/10 flex justify-center">
                  <Button size="sm" variant="primary" onClick={scrollToContact} className="px-5">
                    {t('getTheOffer')}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </AnimatedDiv>
          )}

          {packagesLoading && <div className="text-center text-muted">{t('packages.loading')}</div>}
          {packagesError && <div className="text-center text-error">{t('packages.error')}</div>}
          {!packagesLoading && !packagesError && (!packages || packages.length === 0) && (
            <div className="text-center text-muted">{t('packages.noPackages')}</div>
          )}

          {!!packages?.length && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <AnimatedDiv key={pkg.id} delay={index * 0.1}>
                  <div className="relative bg-surface rounded-2xl p-6 border border-border/50 h-full hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                    {pkg.discountPrice != null && (
                      <div className="absolute -top-2.5 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {t('discounts.offer')}
                      </div>
                    )}

                    <h3 className="text-xl font-heading font-bold text-text mb-3">{pkg.name}</h3>

                    <div className="flex items-baseline gap-2 mb-4">
                      {pkg.discountPrice != null && (
                        <span className="text-lg text-muted line-through">{formatPrice(pkg.price)}</span>
                      )}
                      <span className="text-2xl sm:text-3xl font-bold text-primary">
                        {formatPrice(pkg.discountPrice ?? pkg.price)}
                      </span>
                      <span className="text-muted text-sm">{t('packages.currency')}</span>
                    </div>

                    {pkg.description && (
                      <p className="text-muted text-sm mb-4 leading-relaxed">{pkg.description}</p>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-text">
                        {pkg.features.sms.limit > 0
                          ? `${pkg.features.sms.limit} ${t('packages.smsPerMonth')}`
                          : t('packages.unlimitedSMS')}
                      </span>
                    </div>
                  </div>
                </AnimatedDiv>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 sm:py-24 bg-card/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimatedDiv className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Funcționalități</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-text mt-2 mb-3">
              {t('home.features.title')}
            </h2>
            <p className="text-muted max-w-xl mx-auto">{t('home.features.subtitle')}</p>
          </AnimatedDiv>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <AnimatedDiv key={index} delay={index * 0.1}>
                <div className="bg-surface rounded-2xl p-6 border border-border/50 h-full hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-text mb-2">{feature.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimatedDiv className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Simplu și Rapid</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-text mt-2 mb-3">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-muted max-w-xl mx-auto">{t('home.howItWorks.subtitle')}</p>
          </AnimatedDiv>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-4">
            {[
              { step: '1', title: t('home.howItWorks.step1.title'), desc: t('home.howItWorks.step1.description') },
              { step: '2', title: t('home.howItWorks.step2.title'), desc: t('home.howItWorks.step2.description') },
              { step: '3', title: t('home.howItWorks.step3.title'), desc: t('home.howItWorks.step3.description') },
            ].map((item, index) => (
              <AnimatedDiv key={index} delay={index * 0.15} className="relative">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-text mb-2">{item.title}</h3>
                  <p className="text-muted text-sm">{item.desc}</p>
                </div>
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden sm:block absolute top-7 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/40 to-transparent" />
                )}
              </AnimatedDiv>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedDiv className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Avantaje</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-text mt-2 mb-3">
              De ce să alegi <span className="text-primary">RoadReady</span>?
            </h2>
          </AnimatedDiv>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((item, index) => (
              <AnimatedDiv key={index} delay={index * 0.05}>
                <div className="flex items-center gap-3 bg-surface rounded-xl p-4 border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-text text-sm font-medium">{item.text}</span>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA SECTION */}
      <section ref={contactRef} className="py-16 sm:py-24 bg-card/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedDiv>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-text mb-4">
              {t('home.contact.title')}
            </h2>
            <p className="text-muted mb-8 max-w-lg mx-auto">{t('home.contact.description')}</p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-8">
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center justify-center gap-2 text-primary font-medium hover:underline"
              >
                <Mail className="w-5 h-5" />
                {contactEmail}
              </a>
              <a
                href={`tel:${contactPhoneRaw}`}
                className="inline-flex items-center justify-center gap-2 text-primary font-medium hover:underline"
              >
                <Phone className="w-5 h-5" />
                {contactPhone}
              </a>
            </div>

            <Link to={primaryCtaLink}>
              <Button size="md" variant="primary" className="px-8">
                {t('loginButton')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </AnimatedDiv>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="RoadReady" className="h-8 w-8 rounded-lg" />
              <span className="text-lg font-bold font-heading text-primary">RoadReady</span>
            </div>

            <div className="text-muted text-sm">
              © {new Date().getFullYear()} {brandName}. {t('home.footer.rights')}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <Link to="/terms" className="text-muted hover:text-primary transition-colors">
                {t('home.footer.terms')}
              </Link>
              <a href={`mailto:${contactEmail}`} className="text-muted hover:text-primary transition-colors">
                {t('home.footer.contact')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InspectorPage;
