import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { DarkModeProvider } from './contexts/DarkModeContext'
import { PlannerProvider } from './contexts/PlannerContext'
import { ToastProvider } from './contexts/ToastContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Planner from './pages/Planner'
import Recipes from './pages/Recipes'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import RecipeForm from './pages/RecipeForm'
import RecipeDetail from './components/RecipeDetail'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import RecipeCollections from './components/RecipeCollections'
import HomeRoute from './components/HomeRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <DarkModeProvider>
          <PlannerProvider>
            <ToastProvider>
              <Routes>
              <Route path="/login" element={
                <PublicRoute>
                  <Layout><Login /></Layout>
                </PublicRoute>
              } />
              <Route path="/" element={<HomeRoute />} />
              <Route path="/home" element={
                <Layout><Home /></Layout>
              } />
              <Route path="/about" element={
                <ProtectedRoute>
                  <Layout><About /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/planner" element={
                <ProtectedRoute>
                  <Layout><Planner /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/recipes" element={
                <ProtectedRoute>
                  <Layout><Recipes /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/recipes/new" element={
                <ProtectedRoute>
                  <Layout><RecipeForm /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/recipes/:id/edit" element={
                <ProtectedRoute>
                  <Layout><RecipeForm /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/recipe/:id" element={
                <ProtectedRoute>
                  <Layout><RecipeDetail /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout><Profile /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile/edit" element={
                <ProtectedRoute>
                  <Layout><EditProfile /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/collections" element={
                <ProtectedRoute>
                  <Layout><RecipeCollections /></Layout>
                </ProtectedRoute>
              } />
              </Routes>
            </ToastProvider>
          </PlannerProvider>
        </DarkModeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

