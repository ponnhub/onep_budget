import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import UserPage from './pages/UserPage';
import EventPage from './pages/EventPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import BudgetPage from './pages/BudgetPage';
import EventFormPage from './pages/EventFormPage';
import Profile from './pages/Profile';
import AdminPage from './pages/AdminPage';
import ManualPage from './pages/ManualPage';
import DownloadPage from './pages/DownloadPage';
import AuditPage from './pages/AuditPage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        // { path: 'user', element: <UserPage /> },
        { path: 'event', element: <EventPage />, },
        { path: 'event/refresh', element: <EventPage />, },
        { path: 'eventform', element: <EventFormPage />, },
        { path: 'auditdraft', element: <AuditPage />, },
        { path: 'budget', element: <BudgetPage />, },
        { path: 'profile', element: <Profile openToEdit={false} />, },
        { path: 'admin', element: <AdminPage />, },
        { path: 'users', element: <UserPage />, },
        { path: 'products', element: <ProductsPage /> },
        // { path: 'group', element: <GroupPage /> }, // (group) => <GroupPage group={group} />
        // { path: 'user', element: <AppUserPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'download',
      element: <DownloadPage />,
    },
    {
      path: 'manual',
      element: <ManualPage />
    },
    {
      path: '/login/signout',
      element: <LoginPage signout={Boolean(true)} />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
