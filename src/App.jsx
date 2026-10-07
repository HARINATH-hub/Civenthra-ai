import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';

// Layouts
import CitizenLayout from './layouts/CitizenLayout';
import AuthorityLayout from './layouts/AuthorityLayout';

// Public & Citizen Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportIssuePage from './pages/citizen/ReportIssuePage';
import AIAnalysisPage from './pages/citizen/AIAnalysisPage';
import SmartTicketPage from './pages/citizen/SmartTicketPage';
import MyComplaintsPage from './pages/citizen/MyComplaintsPage';
import ComplaintTrackingPage from './pages/citizen/ComplaintTrackingPage';
import CitizenMapView from './pages/citizen/CitizenMapView';
import NotificationsPage from './pages/citizen/NotificationsPage';
import CitizenProfilePage from './pages/citizen/CitizenProfilePage';
import CitizenSettingsPage from './pages/citizen/CitizenSettingsPage';

// Authority Pages
import AuthorityLoginPage from './pages/authority/AuthorityLoginPage';
import AuthorityDashboard from './pages/authority/AuthorityDashboard';
import AuthorityComplaintsPage from './pages/authority/AuthorityComplaintsPage';
import AuthorityComplaintDetailPage from './pages/authority/AuthorityComplaintDetailPage';
import AuthorityMapView from './pages/authority/AuthorityMapView';
import AuthorityDepartmentsPage from './pages/authority/AuthorityDepartmentsPage';
import AuthorityResolutionPage from './pages/authority/AuthorityResolutionPage';
import AuthorityAnalyticsPage from './pages/authority/AuthorityAnalyticsPage';
import AuthorityProfilePage from './pages/authority/AuthorityProfilePage';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ComplaintProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Marketing & Auth */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/authority/login" element={<AuthorityLoginPage />} />

                {/* Citizen Portal (Protected in real-world, scoped under CitizenLayout) */}
                <Route path="/citizen" element={<CitizenLayout />}>
                  <Route index element={<Navigate to="/citizen/dashboard" replace />} />
                  <Route path="dashboard" element={<CitizenDashboard />} />
                  <Route path="report" element={<ReportIssuePage />} />
                  <Route path="analysis" element={<AIAnalysisPage />} />
                  <Route path="ticket/:id" element={<SmartTicketPage />} />
                  <Route path="complaints" element={<MyComplaintsPage />} />
                  <Route path="complaints/:id" element={<ComplaintTrackingPage />} />
                  <Route path="map" element={<CitizenMapView />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="profile" element={<CitizenProfilePage />} />
                  <Route path="settings" element={<CitizenSettingsPage />} />
                </Route>

                {/* Authority Portal (Scoped under AuthorityLayout) */}
                <Route path="/authority" element={<AuthorityLayout />}>
                  <Route index element={<Navigate to="/authority/dashboard" replace />} />
                  <Route path="dashboard" element={<AuthorityDashboard />} />
                  <Route path="complaints" element={<AuthorityComplaintsPage />} />
                  <Route path="complaints/:id" element={<AuthorityComplaintDetailPage />} />
                  <Route path="map" element={<AuthorityMapView />} />
                  <Route path="departments" element={<AuthorityDepartmentsPage />} />
                  <Route path="resolution/:id" element={<AuthorityResolutionPage />} />
                  <Route path="verification" element={<AuthorityComplaintsPage />} />
                  <Route path="analytics" element={<AuthorityAnalyticsPage />} />
                  <Route path="settings" element={<AuthorityProfilePage />} />
                  <Route path="profile" element={<AuthorityProfilePage />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ComplaintProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
