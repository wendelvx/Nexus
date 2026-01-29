import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard'; 
import { PrivateRoute } from './PrivateRoute';
import MainLayout from '../components/MainLayout';
import QuizPage from '../pages/QuizPage'; 
import Profile from '../pages/Profile'; 

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

            <Route
                path="/quiz/:quizId"
                element={
                    <PrivateRoute>
                        <QuizPage />
                    </PrivateRoute>
                }
            />

            <Route 
  path="/profile" 
  element={
    <PrivateRoute>
      <MainLayout>
        <Profile />
      </MainLayout>
    </PrivateRoute>
  } 
/>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}