import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Shield, Bell, ArrowLeft, Smartphone, CheckCircle, LogIn } from 'lucide-react';
import logo from '../../../assets/logo.png';
import { routes } from '../../../constants/routes';
import { useRequestOtpMutation, useVerifyOtpMutation } from '../../../rtk/services/customer-auth-service';
import { showToast } from '../../../utils/showToast';
import { Button } from '../../../components/shared/Button';
import { PhoneNumberRoInput } from '../../../components/PhoneNumberRoInput';
import { OtpInput } from '../../../components/shared/OtpInput';
import { customerSession } from '../../../utils/customerSession';

type LoginStep = 'phone' | 'otp' | 'already-logged-in';

const CustomerLoginPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState<LoginStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loggedInUserName, setLoggedInUserName] = useState('');

  const [requestOtp, { isLoading: isRequestingOtp }] = useRequestOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  // Check if already logged in on mount
  useEffect(() => {
    const session = customerSession.get();
    if (session) {
      setLoggedInUserName(session.user.firstName || '');
      setStep('already-logged-in');
    }
  }, []);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (otpExpiresIn <= 0) return;

    const timer = setInterval(() => {
      setOtpExpiresIn((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [otpExpiresIn]);

  const validatePhone = (): boolean => {
    if (!phoneNumber || phoneNumber.length < 12) {
      setPhoneError(t('customer.login.invalidPhone'));
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleRequestOtp = async () => {
    if (!validatePhone()) return;

    try {
      const response = await requestOtp({ phoneNumber }).unwrap();
      if (response.success) {
        setStep('otp');
        setOtpExpiresIn(response.expiresIn);
        setOtpCode('');
        setOtpError('');
        showToast(t('customer.login.otpSent'), 'success');
      }
    } catch {
      showToast(t('customer.login.otpRequestFailed'), 'error');
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      setOtpError(t('customer.login.invalidOtp'));
      return;
    }

    try {
      const response = await verifyOtp({ phoneNumber, code: otpCode }).unwrap();

      if (response.isNewUser && response.tempToken) {
        // New user - redirect to registration with temp token
        navigate(routes.CUSTOMER_REGISTER, {
          state: { phoneNumber, tempToken: response.tempToken }
        });
      } else if (response.accessToken && response.user) {
        // Existing user - save session and redirect to dashboard
        customerSession.save(response.accessToken, response.user);
        showToast(t('customer.login.loginSuccess'), 'success');
        navigate(routes.CUSTOMER_DASHBOARD);
      }
    } catch {
      setOtpError(t('customer.login.invalidOtp'));
    }
  };

  const handleResendOtp = async () => {
    setOtpCode('');
    setOtpError('');
    await handleRequestOtp();
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtpCode('');
    setOtpError('');
    setOtpExpiresIn(0);
  };

  const handleGoToDashboard = () => {
    navigate(routes.CUSTOMER_DASHBOARD);
  };

  const handleLogoutAndLogin = () => {
    customerSession.clear();
    setStep('phone');
    setLoggedInUserName('');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canSubmitPhone = phoneNumber.length >= 12 && !isRequestingOtp;
  const canSubmitOtp = otpCode.length === 6 && !isVerifyingOtp;

  const features = [
    { icon: <Car className="w-5 h-5" />, text: t('customer.login.feature1') },
    { icon: <Bell className="w-5 h-5" />, text: t('customer.login.feature2') },
    { icon: <Shield className="w-5 h-5" />, text: t('customer.login.feature3') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex">
      {/* Left Side - Features (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <img src={logo} alt="RoadReady" className="h-12 w-12 rounded-xl" />
              <span className="text-2xl font-bold font-heading text-primary">RoadReady</span>
            </div>

            <h1 className="text-3xl font-bold text-text mb-4 font-heading">
              {t('customer.login.welcomeTitle')}
            </h1>
            <p className="text-muted mb-8 text-lg">
              {t('customer.login.welcomeSubtitle')}
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-surface/50 backdrop-blur-sm rounded-xl border border-border/30"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <span className="text-text font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div
            className="lg:hidden flex items-center justify-center mb-8 cursor-pointer"
            onClick={() => navigate(routes.HOME)}
          >
            <img src={logo} alt="RoadReady" className="h-12 w-12 rounded-xl mr-3" />
            <span className="text-2xl font-bold font-heading text-primary">RoadReady</span>
          </div>

          {/* Back to Home Link (desktop) */}
          <Link
            to={routes.HOME}
            className="hidden lg:inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('customer.login.backToHome')}
          </Link>

          {/* Form Card */}
          <div className="bg-surface rounded-2xl border border-border/50 p-6 sm:p-8 shadow-lg">
            {/* Already Logged In State */}
            {step === 'already-logged-in' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-text font-heading mb-2">
                      {t('customer.login.alreadyLoggedInTitle')}
                    </h2>
                    <p className="text-muted font-body">
                      {t('customer.login.alreadyLoggedInMessage', { name: loggedInUserName })}
                    </p>
                  </div>
                  <div className="space-y-3 pt-2">
                    <Button
                      type="button"
                      fullWidth
                      variant="primary"
                      onClick={handleGoToDashboard}
                      className="py-3"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      {t('customer.login.goToDashboard')}
                    </Button>
                    <Button
                      type="button"
                      fullWidth
                      variant="secondary"
                      onClick={handleLogoutAndLogin}
                      className="py-3"
                    >
                      {t('customer.login.switchAccount')}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phone Step */}
            {step === 'phone' && (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-text font-heading">
                    {t('customer.login.title')}
                  </h2>
                </div>
                <p className="text-sm text-muted mb-6">
                  {t('customer.login.subtitle')}
                </p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-5">
                    <PhoneNumberRoInput
                      label={t('customer.login.phoneLabel')}
                      value={phoneNumber}
                      onChange={(val) => {
                        setPhoneNumber(val);
                        setPhoneError('');
                      }}
                      error={phoneError}
                      isRequired
                    />

                    <p className="text-sm text-muted text-center font-body">
                      {t('customer.login.phoneHint')}
                    </p>

                    <Button
                      type="button"
                      fullWidth
                      variant="primary"
                      disabled={!canSubmitPhone}
                      loading={isRequestingOtp}
                      onClick={handleRequestOtp}
                      className="py-3"
                    >
                      {t('customer.login.requestOtp')}
                    </Button>
                  </div>
                </motion.div>
              </>
            )}

            {/* OTP Step */}
            {step === 'otp' && (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-text font-heading">
                    {t('customer.login.title')}
                  </h2>
                </div>
                <p className="text-sm text-muted mb-6">
                  {t('customer.login.subtitle')}
                </p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-5">
                    <div className="bg-primary/5 rounded-lg p-3 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <p className="text-sm text-text font-body">
                        {t('customer.login.otpSentTo', { phone: phoneNumber })}
                      </p>
                    </div>

                    <OtpInput
                      value={otpCode}
                      onChange={(val) => {
                        setOtpCode(val);
                        setOtpError('');
                      }}
                      error={otpError}
                      disabled={isVerifyingOtp}
                    />

                    {otpExpiresIn > 0 ? (
                      <p className="text-sm text-muted text-center font-body">
                        {t('customer.login.otpExpiresIn', { time: formatTime(otpExpiresIn) })}
                      </p>
                    ) : (
                      <p className="text-sm text-error text-center font-body">{t('customer.login.otpExpired')}</p>
                    )}

                    <Button
                      type="button"
                      fullWidth
                      variant="primary"
                      disabled={!canSubmitOtp || otpExpiresIn === 0}
                      loading={isVerifyingOtp}
                      onClick={handleVerifyOtp}
                      className="py-3"
                    >
                      {t('customer.login.verifyOtp')}
                    </Button>

                    <div className="flex justify-between text-sm font-body pt-2">
                      <button
                        type="button"
                        onClick={handleBackToPhone}
                        className="text-primary hover:text-primary-hover font-medium flex items-center gap-1"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        {t('customer.login.changePhone')}
                      </button>

                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isRequestingOtp}
                        className="text-primary hover:text-primary-hover font-medium disabled:text-muted"
                      >
                        {t('customer.login.resendOtp')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>

          {/* Footer Links */}
          {step !== 'already-logged-in' && (
            <div className="mt-6 space-y-4">
              <div className="text-center text-sm text-text/70 font-body">
                <Link to={routes.LOGIN} className="text-primary hover:text-primary-hover font-medium">
                  {t('customer.login.businessLogin')}
                </Link>
              </div>

              <div className="text-center text-xs text-text/50 font-body">
                {t('customer.login.termsInfo.prefix')}{' '}
                <Link to={routes.TERMS} target="_blank" className="text-primary hover:text-primary-hover underline">
                  {t('customer.login.termsInfo.link')}
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
