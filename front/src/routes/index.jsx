import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login'; 
import Dashboard from '../pages/Dashboard'; // Importamos a nova página
import { PrivateRoute } from './PrivateRoute';
import MainLayout from '../components/MainLayout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        } 
      />

      <Route 
        path="/quests" 
        element={
          <PrivateRoute>
            <MainLayout>
              <div className="text-white text-2xl">Quadro de Missões</div>
            </MainLayout>
          </PrivateRoute>
        } 
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}