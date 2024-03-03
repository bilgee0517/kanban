import React from 'react';
// Import Container from react-bootstrap for consistent styling
import { Container } from 'react-bootstrap';
// Import components from react-router-dom to handle routing
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// HomePage component - the main page shown to authenticated users
import HomePage from './pages/HomePage';
// Import Bootstrap CSS
import 'react-bootstrap/dist/react-bootstrap.min';
// ProtectedRoute component - a wrapper for routes that require authentication
import ProtectedRoute from './components/ProtectedRoutes';
// AuthPage component - the authentication page for login and signup
import AuthPage from './pages/AuthPage';
// TasksProvider - context provider for tasks, wraps the app to provide global state
import { TasksProvider } from './Services/TasksContext';

export default function App() {
  return (
    // Container component from react-bootstrap for consistent spacing and alignment
    <Container>
      {/* TasksProvider component wraps the Router to provide tasks context throughout the app */}
      <TasksProvider>
        {/* Router component to handle navigation and routing between different components */}
        <Router>
          <Routes>
            {/* Route for the authentication page */}
            <Route path="/" element={<AuthPage />} />
            {/* Protected route for the home page, only accessible if authenticated */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            {/* Catch-all route redirects any unknown URLs to the authentication page */}
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </Router>
      </TasksProvider>
    </Container>
  );
}
