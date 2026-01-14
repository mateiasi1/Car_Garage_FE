import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useContext, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
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
  UserPlus,
  FileCheck,
  Sparkles,
  CheckCircle2,
  Check,
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// Animated Section wrapper
const AnimatedSection = ({
  children,
  className = '',
  variants = fadeInUp,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: typeof fadeInUp;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Feature Card
const FeatureCard = ({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative bg-card/90 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-xl hover:shadow-2xl transition-shadow duration-500"
    >
      {/* Icon */}
      <motion.div
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-text mb-6 shadow-lg"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {icon}
      </motion.div>

      {/* Content */}
      <h3 className="text-xl font-heading font-bold text-text mb-3 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-text/70 font-body leading-relaxed">{description}</p>

      {/* Decorative gradient */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

// Step Card for How It Works
const StepCard = ({
  number,
  icon,
  title,
  description,
  index,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative flex flex-col items-center text-center"
    >
      {/* Number badge */}
      <motion.div
        className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-text text-3xl font-heading font-bold shadow-xl mb-6"
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {number}
      </motion.div>

      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center text-primary mb-4 shadow-lg border border-text/10">
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-lg font-heading font-bold text-text mb-2">{title}</h3>
      <p className="text-text/70 font-body text-sm leading-relaxed max-w-xs">{description}</p>

      {/* Connector line (except last) */}
      {index < 2 && (
        <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
      )}
    </motion.div>
  );
};

const About = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useContext(AuthContext);
  const heroRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const { data: packages, isLoading: packagesLoading, error: packagesError } = useFetchPublicPackagesQuery();

  // Parallax effect for hero background
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const primaryCtaLink = isAuthenticated ? routes.ADMINISTRATION : routes.LOGIN;
  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const formatPrice = (price: number) =>
    new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 }).format(price);

  const features = [
    {
      icon: <Building2 className="w-7 h-7" />,
      title: t('home.features.stations.title'),
      description: t('home.features.stations.description'),
    },
    {
      icon: <ClipboardCheck className="w-7 h-7" />,
      title: t('home.features.inspections.title'),
      description: t('home.features.inspections.description'),
    },
    {
      icon: <Bell className="w-7 h-7" />,
      title: t('home.features.notifications.title'),
      description: t('home.features.notifications.description'),
    },
  ];

  const steps = [
    {
      number: '1',
      icon: <UserPlus className="w-6 h-6" />,
      title: t('home.howItWorks.step1.title'),
      description: t('home.howItWorks.step1.description'),
    },
    {
      number: '2',
      icon: <FileCheck className="w-6 h-6" />,
      title: t('home.howItWorks.step2.title'),
      description: t('home.howItWorks.step2.description'),
    },
    {
      number: '3',
      icon: <Sparkles className="w-6 h-6" />,
      title: t('home.howItWorks.step3.title'),
      description: t('home.howItWorks.step3.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      {/* HERO SECTION - Full screen with background image */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Multi-layer gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-primary/5 z-0" />

        {/* Background Image with Parallax */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-background/80 to-background z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-primary/20 z-10" />
          <img
            src={carHome}
            alt="Background"
            className="w-full h-full object-cover object-center scale-110 opacity-30 mix-blend-luminosity"
          />
        </motion.div>

        {/* Animated gradient orbs - more prominent */}
        <motion.div
          className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary/40 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-primary/30 rounded-full blur-[80px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        {/* Hero Content */}
        <motion.div
          className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ opacity: heroOpacity }}
        >
          {/* Logo */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src={logo}
              alt="RoadReady Logo"
              className="h-14 w-14 rounded-2xl shadow-2xl"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            />
            <span className="text-3xl font-bold font-heading bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              RoadReady
            </span>
          </motion.div>

          {/* Badge */}
          <motion.span
            className="inline-block px-5 py-2 bg-primary/20 backdrop-blur-sm text-primary text-sm font-semibold rounded-full mb-8 border border-primary/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            {t('home.hero.badge')}
          </motion.span>

          {/* Title */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-text">{t('home.hero.title').split(' ').slice(0, 2).join(' ')}</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              {t('home.hero.title').split(' ').slice(2).join(' ')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl text-text/70 max-w-2xl mx-auto mb-10 font-body leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {t('home.hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Button
              size="md"
              variant="primary"
              onClick={scrollToContact}
              className="rounded-full shadow-lg shadow-primary/30 px-6 py-2.5 font-medium group hover:scale-105 active:scale-[0.98] transition-transform"
            >
              {t('home.hero.cta')}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Link to={primaryCtaLink}>
              <Button
                size="md"
                variant="primary"
                className="rounded-full shadow-lg shadow-primary/30 px-6 py-2.5 font-medium group hover:scale-105 active:scale-[0.98] transition-transform"
              >
                {t('loginButton')}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 relative bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <AnimatedSection className="text-center mb-16">
            <motion.span
              className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Funcționalități
            </motion.span>
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-text mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {t('home.features.title')}
            </motion.h2>
            <motion.p
              className="text-text/60 font-body text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {t('home.features.subtitle')}
            </motion.p>
          </AnimatedSection>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-card/30 to-primary/5 relative overflow-hidden">
        {/* Decorative gradient orb */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <AnimatedSection className="text-center mb-20">
            <motion.span
              className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Simplu și Rapid
            </motion.span>
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-text mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {t('home.howItWorks.title')}
            </motion.h2>
            <motion.p
              className="text-text/60 font-body text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {t('home.howItWorks.subtitle')}
            </motion.p>
          </AnimatedSection>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative">
            {steps.map((step, index) => (
              <StepCard key={index} {...step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-24 relative overflow-hidden">
        {/* Background with subtle car image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
          <img
            src={carHome}
            alt=""
            className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-auto opacity-[0.07] object-contain pointer-events-none"
          />
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/15 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-12">
            <motion.span
              className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Avantaje
            </motion.span>
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-text mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              De ce să alegi <span className="text-primary">RoadReady</span>?
            </motion.h2>
            <motion.p
              className="text-text/60 font-body text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Platforma completă pentru managementul stației tale ITP
            </motion.p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Interfață intuitivă și ușor de folosit' },
              { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Notificări automate pentru clienții tăi' },
              { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Rapoarte detaliate și statistici în timp real' },
              { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Suport tehnic dedicat' },
              { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Securitate avansată a datelor' },
              { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Actualizări și îmbunătățiri continue' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-4 bg-card/60 backdrop-blur-sm rounded-2xl p-5 border border-primary/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(var(--color-primary-rgb), 0.05)' }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                  {item.icon}
                </div>
                <span className="text-text font-body font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12">
            <Button
              size="md"
              variant="primary"
              onClick={scrollToContact}
              className="rounded-full px-6 py-2.5 group shadow-lg shadow-primary/30 hover:scale-105 active:scale-[0.98] transition-transform"
            >
              {t('home.hero.cta')}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* PACKAGES SECTION */}
      <section className="py-24 relative bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <motion.span
              className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {t('packages.name')}
            </motion.span>
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-text mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {t('packages.availablePackages')}
            </motion.h2>
            <motion.p
              className="text-text/60 font-body text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {t('packages.choosePackageDescription')}
            </motion.p>
          </AnimatedSection>

          {packagesLoading && <div className="text-center text-text/70 font-body">{t('packages.loading')}</div>}

          {packagesError && <div className="text-center text-error font-body">{t('packages.error')}</div>}

          {!packagesLoading && !packagesError && (!packages || packages.length === 0) && (
            <div className="text-center text-text/70 font-body">{t('packages.noPackages')}</div>
          )}

          {!!packages?.length && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  className="group relative bg-card/90 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-xl hover:shadow-2xl transition-shadow duration-500"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <div className="flex items-start justify-between gap-6 mb-4">
                    <h3 className="text-2xl font-heading font-bold text-text group-hover:text-primary transition-colors duration-300">
                      {pkg.name}
                    </h3>
                    <div className="text-right">
                      <span className="text-3xl font-bold font-heading text-primary">{formatPrice(pkg.price)}</span>
                      <span className="ml-1 text-text/60 font-body">{t('packages.currency')}</span>
                    </div>
                  </div>

                  {pkg.description && (
                    <p className="text-sm text-muted font-body leading-relaxed mb-6">{pkg.description}</p>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-body text-text">
                        {pkg.features.sms.limit > 0
                          ? `${pkg.features.sms.limit} ${t('packages.smsPerMonth')}`
                          : t('packages.unlimitedSMS')}
                      </span>
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section ref={contactRef} className="py-32 relative overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <AnimatedSection>
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-text mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {t('home.contact.title')}
            </motion.h2>

            <motion.p
              className="text-lg text-text/60 font-body max-w-xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {t('home.contact.description')}
            </motion.p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
              <motion.a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center justify-center gap-2 text-primary font-semibold font-body text-lg group hover:gap-3 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <Mail className="w-5 h-5" />
                {t('home.contact.button')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.a
                href={`tel:${contactPhoneRaw}`}
                className="inline-flex items-center justify-center gap-2 text-primary font-semibold font-body text-lg group hover:gap-3 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <Phone className="w-5 h-5" />
                {contactPhone}
              </motion.a>
            </div>

            <motion.div
              className="mt-12 pt-8 border-t border-primary/20 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link to={primaryCtaLink}>
                <Button
                  size="md"
                  variant="primary"
                  className="rounded-full shadow-lg shadow-primary/30 px-6 py-2.5 font-medium group hover:scale-105 active:scale-[0.98] transition-transform"
                >
                  {t('loginButton')}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* FOOTER */}
      <motion.footer
        className="py-12 border-t border-primary/10 bg-gradient-to-b from-primary/5 to-background"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src={logo} alt="RoadReady" className="h-10 w-10 rounded-xl" />
              <span className="text-xl font-bold font-heading text-primary">RoadReady</span>
            </div>

            {/* Copyright */}
            <div className="text-text/60 font-body text-sm text-center">
              © 2025 {brandName}. {t('home.footer.rights')}
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm font-body">
              <Link to="/terms" className="text-text/60 hover:text-primary transition-colors">
                {t('home.footer.terms')}
              </Link>
              <a
                href={`mailto:${contactEmail}`}
                className="text-text/60 hover:text-primary transition-colors flex items-center gap-1"
              >
                <Mail className="w-4 h-4" />
                {t('home.footer.contact')}
              </a>
              <a
                href={`tel:${contactPhoneRaw}`}
                className="text-text/60 hover:text-primary transition-colors flex items-center gap-1"
              >
                <Phone className="w-4 h-4" />
                {contactPhone}
              </a>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default About;
