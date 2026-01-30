import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import { routes } from '../../../constants/routes';
import { useCustomerRegisterMutation } from '../../../rtk/services/customer-auth-service';
import { showToast } from '../../../utils/showToast';
import { Button } from '../../../components/shared/Button';
import { CustomCheckbox } from '../../../components/shared/CustomCheckbox';
import { CustomInput } from '../../../components/shared/CustomInput';
import { FormContainer } from '../../../components/shared/FormContainer';
import { useForm } from '../../../hooks/useForm';
import { customerSession } from '../../../utils/customerSession';

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  gdprConsent: boolean;
}

const CustomerRegisterPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as { phoneNumber?: string; tempToken?: string } | null;
  const phoneNumber = locationState?.phoneNumber || '';
  const tempToken = locationState?.tempToken || '';

  const [registerMutation, { isLoading }] = useCustomerRegisterMutation();

  const { values, errors, canSubmit, handleSubmit, register, setFieldValue } = useForm<RegisterFormValues>({
    initialValues: { firstName: '', lastName: '', gdprConsent: false },
    fields: {
      firstName: { required: true, validate: (v) => (String(v).length < 2 ? 'validation.minLength' : null) },
      lastName: { required: true, validate: (v) => (String(v).length < 2 ? 'validation.minLength' : null) },
      gdprConsent: { validate: (v) => (v !== true ? 'customer.register.gdprRequired' : null) },
    },
    onSubmit: async (formValues) => {
      if (!phoneNumber || !tempToken) {
        showToast(t('customer.register.noPhone'), 'error');
        navigate(routes.CUSTOMER_LOGIN);
        return;
      }

      try {
        const response = await registerMutation({
          phoneNumber,
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          gdprConsent: true,
          tempToken,
        }).unwrap();

        if (response.accessToken && response.user) {
          // Save customer session (persists for 1 day)
          customerSession.save(response.accessToken, response.user);
          showToast(t('customer.register.success'), 'success');
          navigate(routes.CUSTOMER_DASHBOARD);
        }
      } catch {
        showToast(t('customer.register.failed'), 'error');
      }
    },
  });

  // Redirect if no phone number or tempToken in state
  useEffect(() => {
    if (!phoneNumber || !tempToken) {
      navigate(routes.CUSTOMER_LOGIN);
    }
  }, [phoneNumber, tempToken, navigate]);

  // Redirect if already logged in as customer
  useEffect(() => {
    const session = customerSession.get();
    if (session) {
      navigate(routes.CUSTOMER_DASHBOARD);
    }
  }, [navigate]);

  const onSubmit = handleSubmit();

  return (
    <FormContainer onSubmit={onSubmit} noValidate>
      <div className="flex flex-col">
        <div
          className="flex items-center justify-center mb-8 cursor-pointer"
          onClick={() => navigate(routes.HOME)}
        >
          <img src={logo} alt="RoadReady Logo" className="h-14 w-14 mr-3" />
          <span className="text-2xl font-bold font-heading text-primary">RoadReady</span>
        </div>

        <h2 className="text-lg font-semibold text-text text-center mb-2 font-heading">
          {t('customer.register.title')}
        </h2>

        <p className="text-sm text-muted text-center mb-6 font-body">
          {t('customer.register.subtitle')}
        </p>

        <div className="space-y-4 pb-4">
          <CustomInput
            label={t('customer.register.firstName')}
            {...register('firstName')}
            error={errors.firstName && t(errors.firstName)}
            placeholder={t('customer.register.firstNamePlaceholder')}
            autoComplete="given-name"
            isRequired
          />

          <CustomInput
            label={t('customer.register.lastName')}
            {...register('lastName')}
            error={errors.lastName && t(errors.lastName)}
            placeholder={t('customer.register.lastNamePlaceholder')}
            autoComplete="family-name"
            isRequired
          />

          <div className="bg-background rounded-lg p-3 border border-border">
            <p className="text-xs text-muted font-body">
              {t('customer.register.phoneLabel')}
            </p>
            <p className="text-sm text-text font-medium font-body">{phoneNumber}</p>
          </div>

          <CustomCheckbox
            id="gdprConsent"
            checked={values.gdprConsent}
            onChange={(e) => setFieldValue('gdprConsent', e.target.checked)}
            label={t('customer.register.gdprConsent')}
            error={errors.gdprConsent && t(errors.gdprConsent)}
          />
        </div>

        <div className="mt-4 space-y-4">
          <Button
            type="submit"
            fullWidth
            variant="primary"
            disabled={!canSubmit}
            loading={isLoading}
          >
            {t('customer.register.submit')}
          </Button>

          <div className="text-center text-sm text-text/70 font-body">
            <Link
              to={routes.CUSTOMER_LOGIN}
              className="text-primary hover:text-primary-hover font-medium underline"
            >
              {t('customer.register.backToLogin')}
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-text/70 font-body">
          {t('customer.login.termsInfo.prefix')}{' '}
          <Link
            to={routes.TERMS}
            target="_blank"
            className="text-primary hover:text-primary-hover font-medium underline"
          >
            {t('customer.login.termsInfo.link')}
          </Link>
        </div>
      </div>
    </FormContainer>
  );
};

export default CustomerRegisterPage;
