import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import PostPage from './pages/PostPage';
import DashboardPage from './pages/DashboardPage';

function Protected({ children }) {
  const { authenticated } = useAuth();
  return authenticated ? children : <Navigate to="/login" replace />;
}

function GuestOnly({ children }) {
  const { authenticated } = useAuth();
  return authenticated ? <Navigate to="/" replace /> : children;
}

function AppRoutes() {
  return <Routes>
    <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
    <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
    <Route element={<Protected><Layout /></Protected>}>
      <Route path="/" element={<FeedPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/u/:username" element={<ProfilePage />} />
      <Route path="/posts/:id" element={<PostPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}

export default function App() {
  return <BrowserRouter><AuthProvider><AppRoutes /></AuthProvider></BrowserRouter>;
}
