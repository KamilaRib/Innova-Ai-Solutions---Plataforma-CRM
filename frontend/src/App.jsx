import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importando Telas
import Login from './pages/Login';
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
import ContentAutomationSettings from './pages/ContentAutomationSettings';
import CreativeCatalog from './pages/CreativeCatalog';
import ProductCatalog from './pages/ProductCatalog';
import AISettings from './pages/AISettings';
import UserManagement from './pages/UserManagement';
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
            <Route path="calendar" element={<ContentCalendar />} />
            <Route path="creatives" element={<CreativeCatalog />} />
            <Route path="products" element={<ProductCatalog />} />
            <Route path="chats" element={<Chats />} />
            <Route path="leads" element={<BaseContatos />} />
            <Route path="social" element={<Navigate to="social/facebook" replace />} />
            <Route path="social/facebook" element={<FacebookSettings />} />
            <Route path="social/instagram" element={<InstagramSettings />} />
            <Route path="social/tiktok" element={<TikTokSettings />} />
            <Route path="social/youtube" element={<YoutubeSettings />} />
            <Route path="social/automation" element={<ContentAutomationSettings />} />
            <Route path="settings" element={<Navigate to="branding" replace />} />
            <Route path="settings/branding" element={<BrandingSettings />} />
            <Route path="settings/ai" element={<AISettings />} />
            <Route path="settings/whatsapp" element={<WhatsAppSettings />} />
            <Route path="settings/evolution" element={<EvolutionSettings />} />
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

