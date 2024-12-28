import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./pages/login/loginPage";  // Assuming you have this page component
import AddNew from "./pages/customer/addNew";
import HomePage from "./pages/home/homePage";
import AddNewUserPage from "./pages/user/addNew";
import ProfilePage from "./pages/profile/profilePage";
import SettingsPage from "./pages/settings/settingsPage";
import ReportsPage from "./pages/reports/reportsPage";
import UpcomingPage from "./pages/inspections/upcoming/upcomingPage";
import DailyPage from "./pages/inspections/daily/dailyPage";
import MonthlyPage from "./pages/inspections/monthly/monthlyPage";

const AppRouter = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="customer/add-new" element={<AddNew />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/users/add-new" element={<AddNewUserPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="inspections/upcoming" element={<UpcomingPage />} />
                    <Route path="inspections/daily" element={<DailyPage />} />
                    <Route path="inspections/monthly" element={<MonthlyPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default AppRouter;
