import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import DesignersPage from './pages/DesignersPage.jsx';
import DesignerPage from './pages/DesignerPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import StatsPage from './pages/StatsPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/designers" element={<DesignersPage />} />
          <Route path="/designers/:id" element={<DesignerPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/order" element={<PrivateRoute><OrderPage /></PrivateRoute>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="*" element={<div className="rounded-[2rem] bg-slate-900 p-10 shadow-soft text-center text-slate-200">{t('siteName')} - {t('pageNotFound')}</div>} />
        </Routes>
      </main>
    </div>
  );
}
