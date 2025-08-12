
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Simulation from '@/pages/Simulation';
import History from '@/pages/History';
import Drivers from '@/pages/Drivers';
import RoutesPage from '@/pages/Routes';
import Orders from '@/pages/Orders';
import Settings from '@/pages/Settings';
import Auth from '@/pages/Auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="/simulation" element={<Simulation />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/drivers" element={<Drivers />} />
                    <Route path="/routes" element={<RoutesPage />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
