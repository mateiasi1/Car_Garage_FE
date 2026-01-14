import { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { routes } from '../../constants/routes';
import { contactEmail, contactPhone } from '../../constants/constants';
import { AuthContext } from '../../contexts/authContext';
import { useLoginMutation, LoginResponse } from '../../rtk/services/auth-service';
import { showToast } from '../../utils/showToast';
import { Button } from '../shared/Button';
import { CustomInput } from '../shared/CustomInput';
import { CustomSelect } from '../shared/CustomSelect';
import { FormContainer } from '../shared/FormContainer';
import { useForm } from '../../hooks/useForm';
import LoginBranchForm from './LoginBranchForm';

interface LoginFormValues {
  username: string;
  password: string;
}

interface BranchOption {
  id: string;
  name: string;
}

const Login: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated, user, hasBranchRestriction } = useContext(AuthContext);
  const [loginMutation] = useLoginMutation();

  const [selectBranch, setSelectBranch] = useState(false);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [canAddBranch, setCanAddBranch] = useState(false);

  const { values, errors, canSubmit, handleSubmit, register } = useForm<LoginFormValues>({
    initialValues: { username: '', password: '' },
    fields: {
      username: { required: true },
      password: { required: true },
    },
    onSubmit: async (formValues) => {
      const payload = selectBranch && selectedBranchId ? { ...formValues, branchId: selectedBranchId } : formValues;

      try {
        const data: LoginResponse = await loginMutation(payload).unwrap();

        if (data.selectBranch) {
          setSelectBranch(true);

          setBranches(
            (data.branches ?? []).map((b) => ({
              id: b.id,
              name: b.name,
            }))
          );

          setCanAddBranch(Boolean(data.canAddBranch));

          if (data.branches && data.branches.length > 0 && !selectedBranchId) {
            setSelectedBranchId(data.branches[0].id);
          }

          return;
        }

        if (data.accessToken) {
          login({ accessToken: data.accessToken, hasBranchRestriction: data.hasBranchRestriction });

          if (data.hasBranchRestriction) {
            setSelectBranch(true);
            setBranches([]);
            setCanAddBranch(true);
          }
        } else {
          showToast(t('wrongCredentials'), 'error');
        }
      } catch {
        showToast(t('wrongCredentials'), 'error');
      }
    },
  });

  const onSubmit = handleSubmit();

  useEffect(() => {
    if (!isAuthenticated || !user || hasBranchRestriction) return;

    const isInspectorOnly = user.roles?.some((r) => r.name === 'INSPECTOR');

    // Dashboard for admin/owner/demo, Inspections for inspector-only
    navigate(isInspectorOnly ? routes.INSPECTIONS : routes.DASHBOARD);
  }, [isAuthenticated, user, navigate, hasBranchRestriction]);

  useEffect(() => {
    if (selectBranch && branches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branches[0].id);
    }
  }, [selectBranch, branches, selectedBranchId]);

  const noBranches = selectBranch && branches.length === 0;
  const showCreateBranch = noBranches && canAddBranch;
  const showNoBranchError = noBranches && !canAddBranch;

  const handleBranchCreated = async (branchId: string) => {
    setSelectedBranchId(branchId);
    setBranches([{ id: branchId, name: t('branch.newBranchDefaultName') }]);

    try {
      const data: LoginResponse = await loginMutation({
        username: values.username,
        password: values.password,
        branchId,
      }).unwrap();

      if (data.accessToken) {
        login({ accessToken: data.accessToken, hasBranchRestriction: data.hasBranchRestriction });

        if (!data.hasBranchRestriction) {
          // Clear branch selection UI if no restriction
          setSelectBranch(false);
          setBranches([]);
        }
      } else if (data.selectBranch && data.branches && data.branches.length > 0) {
        setSelectBranch(true);
        setBranches(
          data.branches.map((b) => ({
            id: b.id,
            name: b.name,
          }))
        );
        setCanAddBranch(Boolean(data.canAddBranch));
      } else {
        showToast(t('wrongCredentials'), 'error');
      }
    } catch {
      showToast(t('wrongCredentials'), 'error');
    }
  };

  const shouldHandleLoginSubmit = !showCreateBranch && (!selectBranch || branches.length > 0);

  return (
    <FormContainer onSubmit={shouldHandleLoginSubmit ? onSubmit : undefined} noValidate>
      <div className="flex flex-col">
        <div className="flex items-center justify-center mb-8 cursor-pointer" onClick={() => navigate(routes.HOME)}>
          <img src={logo} alt="RoadReady Logo" className="h-14 w-14 mr-3" />
          <span className="text-2xl font-bold font-heading text-primary">RoadReady</span>
        </div>

        {!showCreateBranch ? (
          <>
            <div className="space-y-6 pb-4 flex-1">
              {!selectBranch && (
                <>
                  <CustomInput
                    label={`${t('usernameTitle')} *`}
                    {...register('username')}
                    error={errors.username && t(errors.username)}
                    placeholder="john@example.com"
                    autoComplete="username"
                  />

                  <CustomInput
                    label={`${t('passwordTitle')} *`}
                    type="password"
                    {...register('password')}
                    error={errors.password && t(errors.password)}
                    placeholder="•••••••"
                    autoComplete="current-password"
                  />
                </>
              )}

              {selectBranch && branches.length > 0 && (
                <CustomSelect
                  label={t('branch.selectBranch')}
                  value={selectedBranchId}
                  onChange={(val) => setSelectedBranchId(val)}
                  options={branches.map((branch) => ({
                    value: branch.id,
                    label: branch.name,
                  }))}
                />
              )}

              {showNoBranchError && (
                <p className="mt-4 text-sm font-body text-error text-center">
                  {t('branch.noBranchesForLoginNoPermission')}
                </p>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <Button
                type="submit"
                fullWidth
                variant="primary"
                disabled={selectBranch ? !selectedBranchId : !canSubmit}
              >
                {t('loginButton')}
              </Button>

              {!selectBranch && (
                <>
                  <div className="mt-2 text-center text-sm text-text/70 font-body">
                    {t('login.termsInfo.prefix')}{' '}
                    <Link
                      to="/terms"
                      target="_blank"
                      className="text-primary hover:text-primary-hover font-medium underline"
                    >
                      {t('login.termsInfo.link')}
                    </Link>
                  </div>

                  <div className="mt-1 text-center text-sm text-text/70 font-body">
                    {t('registerButton', { email: contactEmail, phone: contactPhone })}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4 pb-4 flex-1">
            <p className="text-sm font-body text-text/80">{t('branch.noBranchesForLoginCanCreate')}</p>
            <LoginBranchForm onBranchCreated={handleBranchCreated} />
          </div>
        )}
      </div>
    </FormContainer>
  );
};

export default Login;
