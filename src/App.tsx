import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import UnifiedDashboard from './pages/UnifiedDashboard';
import Verify from './pages/Verify';
import Employer from './pages/Employer';
import Student from './pages/Student';
import Certificates from './pages/Certificates';
import IssueCertificate from './pages/IssueCertificate';
import BulkOperations from './pages/BulkOperations';
import Programs from './pages/Programs';
import InstitutionManagement from './pages/InstitutionManagement';
import GovernmentDashboard from './pages/GovernmentDashboard';
import Students from './pages/Students';
import VerificationHistory from './pages/VerificationHistory';
import Reports from './pages/Reports';
import Unauthorized from './pages/Unauthorized';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <div className="App">
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: '#4ade80',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      duration: 5000,
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Registration />} />
                  <Route path="/verify" element={<Verify />} />
                  <Route path="/verify/:publicId" element={<Verify />} />
                  
                  {/* Protected routes with Layout */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Layout>
                        <UnifiedDashboard />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/certificates" element={
                    <ProtectedRoute>
                      <Layout>
                        <Certificates />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/issue" element={
                    <ProtectedRoute requiredPermission="certificates:create">
                      <Layout>
                        <IssueCertificate />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/bulk" element={
                    <ProtectedRoute requiredPermission="bulk:create">
                      <Layout>
                        <BulkOperations />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Redirect templates to programs for national system */}
                  <Route path="/templates" element={
                    <ProtectedRoute>
                      <Layout>
                        <Programs />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/programs" element={
                    <ProtectedRoute>
                      <Layout>
                        <Programs />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/institutions" element={
                    <ProtectedRoute requiredRole="ministry_admin">
                      <Layout>
                        <InstitutionManagement />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/government" element={
                    <ProtectedRoute>
                      <Layout>
                        <GovernmentDashboard />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/students" element={
                    <ProtectedRoute>
                      <Layout>
                        <Students />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/reports" element={
                    <ProtectedRoute>
                      <Layout>
                        <Reports />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/verification" element={
                    <ProtectedRoute>
                      <Layout>
                        <Verify />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/verification-history" element={
                    <ProtectedRoute>
                      <Layout>
                        <VerificationHistory />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/employer" element={
                    <ProtectedRoute requiredRole="employer">
                      <Layout>
                        <Employer />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/student" element={
                    <ProtectedRoute requiredRole="student">
                      <Layout>
                        <Student />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/unauthorized" element={<Unauthorized />} />
                </Routes>
              </div>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;