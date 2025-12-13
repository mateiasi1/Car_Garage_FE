import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InspectionForm from './components/forms/InspectionForm';
import AdministrationPage from './pages/administration/AdministrationPage';
import InspectionsPage from './pages/inspections/InspectionsPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProtectedLayout from './pages/layout/ProtectedLayout';
import LoginPage from './pages/login/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import { Role } from './utils/enums/Role';
import NotFoundPage from './pages/notfound/NotFoundPage';
import { routes } from './constants/routes';
import Unsubscribe from './components/unsubscribe/Unsubscribe';
import HomePage from './pages/home/homePage';
import TermsPage from './pages/terms/TermsPage';

const AppRouter = () => {
  const authenticatedRoles = [Role.admin, Role.owner, Role.inspector, Role.demo];
  const inspectorRoles = [Role.owner, Role.inspector, Role.demo];
  const dashboardRoles = [Role.admin, Role.owner, Role.demo];

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path={routes.HOME} element={<HomePage />} />
        <Route path={routes.TERMS} element={<TermsPage />} />
        <Route path={routes.UNSUBSCRIBE} element={<Unsubscribe />} />
        <Route path={routes.LOGIN} element={<LoginPage />} />

        {/* AUTHENTICATED AREA WITH LAYOUT */}
        <Route element={<ProtectedRoute element={<ProtectedLayout />} roles={authenticatedRoles} />}>
          <Route
            path={routes.DASHBOARD}
            element={<ProtectedRoute element={<DashboardPage />} roles={dashboardRoles} />}
          />
          <Route
            path={routes.INSPECTIONS}
            element={<ProtectedRoute element={<InspectionsPage />} roles={inspectorRoles} />}
          />
          <Route
            path={routes.ADMINISTRATION}
            element={<ProtectedRoute element={<AdministrationPage />} roles={authenticatedRoles} />}
          />
          <Route
            path={routes.ADD_INSPECTION}
            element={<ProtectedRoute element={<InspectionForm />} roles={inspectorRoles} />}
          />
        </Route>

        {/* CATCH-ALL 404 */}
        <Route path={routes.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
