import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AddNew from './pages/customer/addNew';
import CustomersListPage from './pages/customer/customersList';
import HomePage from './pages/home/homePage';
import DailyPage from './pages/inspections/daily/dailyPage';
import MonthlyPage from './pages/inspections/monthly/monthlyPage';
import UpcomingPage from './pages/inspections/upcoming/upcomingPage';
import LoginPage from './pages/login/LoginPage';
import ProfilePage from './pages/profile/profilePage';
import ReportsPage from './pages/reports/reportsPage';
import SettingsPage from './pages/settings/settingsPage';
import AddNewUserPage from './pages/user/addNew';
import ProtectedRoute from './PrivateRoute';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Public Routes */}
        <Route path="/home" element={<HomePage />} />

        {/* Protected Routes */}
        <Route path="customer/list" element={<ProtectedRoute element={<CustomersListPage />} />} />
        <Route path="customer/add-new" element={<ProtectedRoute element={<AddNew />} />} />
        <Route path="/users/add-new" element={<ProtectedRoute element={<AddNewUserPage />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
        <Route path="/settings" element={<ProtectedRoute element={<SettingsPage />} />} />
        <Route path="/reports" element={<ProtectedRoute element={<ReportsPage />} />} />
        <Route path="inspections/upcoming" element={<ProtectedRoute element={<UpcomingPage />} />} />
        <Route path="inspections/daily" element={<ProtectedRoute element={<DailyPage />} />} />
        <Route path="inspections/monthly" element={<ProtectedRoute element={<MonthlyPage />} />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
