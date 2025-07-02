import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Sidebar from './components/shared/Sidebar/Sidebar';
import DashboardPage from './pages/dashboard/DashboardPage';
import AppLayout from './pages/layout/AppLayout';
import LoginPage from './pages/login/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import InspectionsPage from './pages/inspections/InspectionsPage';
import AdministrationPage from './pages/administration/AdministrationPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/login" element={<LoginPage />} />

          {/* Public Routes */}
          {/* <Route path="/home" element={<HomePage />} /> */}

          {/* Protected Routes */}
          <Route element={<ProtectedRoute element={<Sidebar />} />}>
            <Route path="/" element={<ProtectedRoute element={<DashboardPage />} />} />
            <Route path="/inspections" element={<ProtectedRoute element={<InspectionsPage />} />} />
            <Route path="/administration" element={<ProtectedRoute element={<AdministrationPage />} />} />
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
