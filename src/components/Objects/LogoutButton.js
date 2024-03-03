import React from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../Services/apiClient'; // Import your CustomApiClient instance
import { Button } from 'react-bootstrap';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
      try {
        // Call the logoutUser method from the apiClient instance
        const response = await apiClient.logoutUser();
  
        if (response) {
          // Clear session data or perform any additional cleanup
          localStorage.removeItem('token'); // Clear token from localStorage
          apiClient.setToken(null); 
          navigate('/'); // Redirect to the login page after successful logout
        } else {
          console.error('Failed to logout');
          // Handle logout failure, such as displaying an error message
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle any network or other errors that occur during logout
      }
    };
    
  return (
    <Button onClick={handleLogout} className='logout-button'>Logout</Button>
  );
};

export default LogoutButton;
