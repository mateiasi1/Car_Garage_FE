import { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { routes } from '../../constants/routes';
import { AuthContext } from '../../contexts/authContext';
import { useLoginMutation } from '../../rtk/services/auth-service';
import { showToast } from '../../utils/showToast';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { CustomSelect } from '../shared/CustomSelect';
import { PageContainer } from '../shared/PageContainer';
import { FormContainer } from '../shared/FormContainer';
import { useForm } from '../../hooks/useForm';

interface LoginFormValues {
  username: string;
  password: string;
  branchId?: string;
}

const Login: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useContext(AuthContext);
  const [loginMutation] = useLoginMutation();

  const [selectBranch, setSelectBranch] = useState(false);
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const isAdmin = user.roles?.some((r) => r.name === 'ADMIN');
    navigate(isAdmin ? routes.ADMINISTRATION : routes.INSPECTIONS);
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (selectBranch && branches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branches[0].id);
    }
  }, [selectBranch, branches, selectedBranchId]);

  const { errors, canSubmit, handleSubmit, register } = useForm<LoginFormValues>({
    initialValues: { username: '', password: '' },
    fields: {
      username: { required: true },
      password: { required: true },
    },
    onSubmit: async (formValues) => {
      const payload =
        selectBranch && selectedBranchId ? { ...formValues, branchId: selectedBranchId } : { ...formValues };

      try {
        const data = await loginMutation(payload).unwrap();

        if (data.selectBranch && data.branches) {
          setSelectBranch(true);
          setBranches(data.branches);
          return;
        }

        if (data.accessToken) {
          login({ accessToken: data.accessToken });
        } else {
          showToast(t('wrongCredentials'), 'error');
        }
      } catch {
        showToast(t('wrongCredentials'), 'error');
      }
    },
  });

  const onSubmit = handleSubmit();

  return (
    <PageContainer>
      <FormContainer onSubmit={onSubmit} noValidate>
        <div className="flex items-center justify-center mb-8 cursor-pointer" onClick={() => navigate(routes.HOME)}>
          <img src={logo} alt="RoadReady Logo" className="h-14 w-14 mr-3" />
          <span className="text-2xl font-bold font-heading text-primary">RoadReady</span>
        </div>

        {!selectBranch ? (
          <>
            <Input
              label={`${t('usernameTitle')} *`}
              {...register('username')}
              error={errors.username && t(errors.username)}
              placeholder="john@example.com"
              autoComplete="username"
            />
            <Input
              label={`${t('passwordTitle')} *`}
              type="password"
              {...register('password')}
              error={errors.password && t(errors.password)}
              placeholder="•••••••"
              autoComplete="current-password"
            />
          </>
        ) : (
          <CustomSelect
            label={t('selectBranch')}
            value={selectedBranchId}
            onChange={(val) => setSelectedBranchId(val)}
            options={branches.map((branch) => ({
              value: branch.id,
              label: branch.name,
            }))}
          />
        )}

        <Button type="submit" fullWidth variant="primary" disabled={selectBranch ? !selectedBranchId : !canSubmit}>
          {t('loginButton')}
        </Button>

        {/* Terms & Conditions */}
        <div className="mt-4 text-center text-sm text-text/70 font-body">
          {t('login.termsInfo.prefix')}{' '}
          <Link to="/terms" target="_blank" className="text-primary hover:text-primary-hover font-medium underline">
            {t('login.termsInfo.link')}
          </Link>
        </div>

        {/* Register link */}
        <div className="mt-3 text-center text-sm text-text/70 font-body">{t('registerButton')}</div>
      </FormContainer>
    </PageContainer>
  );
};

export default Login;
