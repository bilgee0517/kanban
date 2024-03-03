import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Import jwt-decode library to decode JWT tokens

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Assuming token presence indicates authentication
  const isTokenExpired = checkTokenExpiration(token); // Check if token is expired

  // Function to check if JWT token is expired
  function checkTokenExpiration(token) {
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Get current time in seconds
      return decodedToken.exp < currentTime; // Compare token expiration time with current time
    }
    return true; // If token is not present, consider it expired
  }

  return token && !isTokenExpired ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
