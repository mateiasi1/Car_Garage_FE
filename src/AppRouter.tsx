import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import InspectionForm from './components/inspections/InspectionForm';
import AdministrationPage from './pages/administration/AdministrationPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import InspectionsPage from './pages/inspections/InspectionsPage';
import AppLayout from './pages/layout/AppLayout';
import ProtectedLayout from './pages/layout/ProtectedLayout';
import LoginPage from './pages/login/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import { Role } from './utils/enums/Role';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={<ProtectedRoute element={<ProtectedLayout />} roles={[Role.admin, Role.owner, Role.inspector]} />}
          >
            {/* <Route
              path="/"
              element={<ProtectedRoute element={<DashboardPage />} roles={[Role.admin, Role.inspector]} />}
            /> */}
            <Route
              path="/inspections"
              element={
                <ProtectedRoute element={<InspectionsPage />} roles={[Role.admin, Role.admin, Role.inspector]} />
              }
            />
            <Route
              path="/administration"
              element={
                <ProtectedRoute element={<AdministrationPage />} roles={[Role.admin, Role.admin, Role.inspector]} />
              }
            />
            <Route
              path="/add-inspection"
              element={<ProtectedRoute element={<InspectionForm />} roles={[Role.admin, Role.inspector]} />}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
