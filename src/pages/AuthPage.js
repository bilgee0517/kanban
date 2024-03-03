import React, { useState } from 'react';
import { Container, Form, Button, Tab, Tabs } from 'react-bootstrap'; // Importing necessary Bootstrap components for UI
import { useNavigate } from 'react-router-dom'; // Hook for programmatically navigating between routes
import apiClient from '../Services/apiClient'; // Custom API client for making HTTP requests to the backend

function AuthPage() {
  // State hooks for managing form inputs and the active tab
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [key, setKey] = useState('login'); // This state determines whether the login or signup tab is active

  const navigate = useNavigate(); // Hook to navigate to different routes

  // Handler for the login form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    try {
      const data = await apiClient.loginUser(username, password); // Attempts to log the user in via the API
      localStorage.setItem('token', data.access_token); // Stores the JWT in local storage for session management
      apiClient.setToken(data.access_token); // Updates the API client with the new token for subsequent requests
      navigate('/home'); // Navigates to the home page upon successful login
    } catch (error) {
      alert('Failed to log in'); // Alerts the user in case of a login failure
    }
  };

  // Handler for the signup form submission
  const handleSignup = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    try {
      const response = await apiClient.signupUser(username, password); // Attempts to sign the user up via the API
      if (response) {
        alert('Signup successful'); // Alerts the user that signup was successful
        navigate('/'); // Navigates back to the login page (or root)
      } else {
        const errorData = await response.json(); // Parses the JSON response from a failed signup attempt
        alert(`Signup failed: ${errorData.message}`); // Alerts the user of the failure reason
      }
    } catch (error) {
      console.error('Signup error:', error); // Logs any errors to the console
      alert('Signup error'); // Alerts the user to a signup error
    }
  };

  return (
    <Container className="mt-5"> {/* Bootstrap Container for layout */}
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)} // Updates the active tab based on user selection
        className="mb-3"
      >
        {/* Login tab with a form for username and password */}
        <Tab eventKey="login" title="Log In">
          <Form onSubmit={handleLogin}>
            {/* Username input field */}
            <Form.Group className="mb-3" controlId="loginUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Updates username state on change
              />
            </Form.Group>

            {/* Password input field */}
            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Updates password state on change
              />
            </Form.Group>

            {/* Submit button for the form */}
            <Button variant="primary" type="submit">
              Log In
            </Button>
          </Form>
        </Tab>
        {/* Signup tab with a form similar to the login form */}
        <Tab eventKey="signup" title="Sign Up">
          <Form onSubmit={handleSignup}>
            {/* Fields identical to the login form, but this form handles user registration */}
            <Form.Group className="mb-3" controlId="signupUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="signupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </Form>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default AuthPage; // Export the component for use in the application
