import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importando Telas
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PublicCatalog from './pages/PublicCatalog';
import ClientLayout from './layouts/ClientLayout';
import Dashboard from './pages/Dashboard';
import Kanban from './pages/Kanban';
import FunnelsConfig from './pages/FunnelsConfig';
import Statistics from './pages/Statistics';
import ROIReport from './pages/ROIReport';
import GoalsReport from './pages/GoalsReport';
import SalesReport from './pages/SalesReport';
import ActivitiesReport from './pages/ActivitiesReport';
import BaseContatos from './pages/BaseContatos';
import Clientes from './pages/Clientes';
import Chats from './pages/Chats';
import BrandingSettings from './pages/BrandingSettings';
import WhatsAppSettings from './pages/WhatsAppSettings';
import EvolutionSettings from './pages/EvolutionSettings';
import FacebookSettings from './pages/FacebookSettings';
import InstagramSettings from './pages/InstagramSettings';
import TikTokSettings from './pages/TikTokSettings';
import YoutubeSettings from './pages/YoutubeSettings';
import Tasks from './pages/Tasks';
import ContentCalendar from './pages/ContentCalendar';
import SchedulePost from './pages/SchedulePost';
import SocialConnections from './pages/SocialConnections';
import ContentAutomationSettings from './pages/ContentAutomationSettings';
import CreativeCatalog from './pages/CreativeCatalog';
import ProductCatalog from './pages/ProductCatalog';
import ProductRegistration from './pages/ProductRegistration';
import ProductCosts from './pages/ProductCosts';
import RegisterSale from './pages/RegisterSale';
import AISettings from './pages/AISettings';
import UserManagement from './pages/UserManagement';
import ProfileSettings from './pages/ProfileSettings';
import StoreSettings from './pages/StoreSettings';
import SecuritySettings from './pages/SecuritySettings';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
    <SettingsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Vitrine / Catálogo Público */}
          <Route path="/c/:storeSlug" element={<PublicCatalog />} />

          {/* Páginas institucionais movidas para o projeto 'Site' */}
          <Route path="/app" element={<ProtectedRoute><ClientLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analysis/sales" element={<SalesReport />} />
            <Route path="analysis/consolidated" element={<Statistics />} />
            <Route path="analysis/roi" element={<ROIReport />} />
            <Route path="analysis/activities" element={<ActivitiesReport />} />
            <Route path="analysis/goals" element={<GoalsReport />} />
            <Route path="kanban" element={<Kanban />} />
            <Route path="funnels" element={<FunnelsConfig />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="social/calendar" element={<ContentCalendar />} />
            <Route path="social/creatives" element={<CreativeCatalog />} />
            <Route path="products" element={<ProductCatalog />} />
            <Route path="products/new" element={<ProductRegistration />} />
            <Route path="products/edit" element={<ProductRegistration />} />
            <Route path="products/costs" element={<ProductCosts />} />
            <Route path="sales/new" element={<RegisterSale />} />
            <Route path="chats" element={<Chats />} />
            <Route path="clients" element={<Clientes />} />
            <Route path="leads" element={<BaseContatos />} />
            <Route path="social" element={<Navigate to="social/hub" replace />} />
            <Route path="social/hub" element={<SocialConnections />} />
            <Route path="social/schedule" element={<SchedulePost />} />
            <Route path="settings" element={<Navigate to="profile" replace />} />
            <Route path="settings/profile" element={<ProfileSettings />} />
            <Route path="settings/store" element={<StoreSettings />} />
            <Route path="settings/security" element={<SecuritySettings />} />
            <Route path="settings/branding" element={<BrandingSettings />} />
            <Route path="settings/ai" element={<AISettings />} />
            <Route path="settings/evolution" element={<EvolutionSettings />} />
            <Route path="settings/whatsapp" element={<WhatsAppSettings />} />
            <Route
              path="settings/users"
              element={
                <ProtectedRoute roles={['ADMINISTRADOR']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </SettingsProvider>
    </AuthProvider>
  );
};

export default App;

