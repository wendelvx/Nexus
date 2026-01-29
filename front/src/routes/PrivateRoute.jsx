import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('@nexus:token');
  
  return token ? children : <Navigate to="/" />;
};