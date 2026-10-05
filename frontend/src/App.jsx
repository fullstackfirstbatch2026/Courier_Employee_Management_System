import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import ParcelsPage from './pages/ParcelsPage';
import RoutesPage from './pages/RoutesPage';
import DeliveriesPage from './pages/DeliveriesPage';
import ReportsPage from './pages/ReportsPage';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="parcels" element={<ParcelsPage />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="deliveries" element={<DeliveriesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
