// src/routes/index.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login'; 
import { PrivateRoute } from './PrivateRoute';

export default function AppRoutes() { 
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <div className="text-white">Logado!</div>
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}