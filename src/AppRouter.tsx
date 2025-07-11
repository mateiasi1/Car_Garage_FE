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

          {/* Public Routes */}
          {/* <Route path="/home" element={<HomePage />} /> */}

          {/* Protected Routes */}
          <Route
            element={<ProtectedRoute element={<ProtectedLayout />} roles={[Role.admin, Role.owner, Role.inspector]} />}
          >
            <Route
              path="/"
              element={<ProtectedRoute element={<DashboardPage />} roles={[Role.admin, Role.inspector]} />}
            />
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
          {/* <Route path="customer/list" element={<ProtectedRoute element={<CustomersListPage />} />} />
        <Route path="customer/add-new" element={<ProtectedRoute element={<AddNew />} />} />
        <Route path="/users/add-new" element={<ProtectedRoute element={<AddNewUserPage />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
        <Route path="/settings" element={<ProtectedRoute element={<SettingsPage />} />} />
        <Route path="/reports" element={<ProtectedRoute element={<ReportsPage />} />} />
        
        <Route path="inspections/daily" element={<ProtectedRoute element={<DailyPage />} />} />
        <Route path="inspections/monthly" element={<ProtectedRoute element={<MonthlyPage />} />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
