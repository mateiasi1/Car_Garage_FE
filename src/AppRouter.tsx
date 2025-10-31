import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import InspectionForm from './components/inspections/InspectionForm';
import AdministrationPage from './pages/administration/AdministrationPage';
// import DashboardPage from './pages/dashboard/DashboardPage';
import InspectionsPage from './pages/inspections/InspectionsPage';
import AppLayout from './pages/layout/AppLayout';
import ProtectedLayout from './pages/layout/ProtectedLayout';
import LoginPage from './pages/login/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import { Role } from './utils/enums/Role';
import NotFoundPage from './pages/notfound/NotFoundPage';
import { routes } from './constants/routes';
import Unsubscribe from "./components/unsubscribe/Unsubscribe.tsx";
import HomePage from "./pages/home/homePage.tsx";
import TermsPage from "./pages/terms/TermsPage.tsx";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* PUBLIC ROUTES  */}
                <Route path={routes.UNSUBSCRIBE} element={<Unsubscribe />} />
                <Route path={routes.HOME} element={<HomePage />} />
                <Route path={routes.TERMS} element={<TermsPage />} />

                {/* AUTHENTICATED ROUTES */}
                <Route element={<AppLayout />}>
                    <Route path={routes.LOGIN} element={<LoginPage />} />
                    <Route
                        element={<ProtectedRoute element={<ProtectedLayout />} roles={[Role.admin, Role.owner, Role.inspector]} />}
                    >
                        {/* <Route
                          path="/"
                          element={<ProtectedRoute element={<DashboardPage />} roles={[Role.admin, Role.inspector]} />}
                        /> */}
                        <Route
                            path={routes.INSPECTIONS}
                            element={<ProtectedRoute element={<InspectionsPage />} roles={[Role.owner, Role.inspector]} />}
                        />
                        <Route
                            path={routes.ADMINISTRATION}
                            element={
                                <ProtectedRoute element={<AdministrationPage />} roles={[Role.admin, Role.owner, Role.inspector]} />
                            }
                        />
                        <Route
                            path={routes.ADD_INSPECTION}
                            element={<ProtectedRoute element={<InspectionForm />} roles={[Role.owner, Role.inspector]} />}
                        />
                    </Route>
                </Route>

                {/* CATCH-ALL 404 */}
                <Route path={routes.NOT_FOUND} element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;