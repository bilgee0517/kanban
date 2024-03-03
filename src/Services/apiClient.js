class CustomApiClient {
  constructor(baseURL) {
    if (!baseURL) {
      throw new Error('BaseURL is required'); // Ensures a baseURL is provided during instantiation
    }
    this.baseURL = baseURL; // Sets the base URL for API requests
    this.token = localStorage.getItem('token'); // Retrieves the authentication token from localStorage, if available
  }

  setToken(token) {
    this.token = token; // Method to update the authentication token
  }

  async request(path, options) {
    // Constructs the full URL for the request
    const url = `${this.baseURL}${path.startsWith('/') ? '' : '/'}${path}`;
    // Sets default headers, including the Authorization header if a token exists
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
    };
    // Makes the HTTP request with fetch, merging in any additional options and the headers
    const response = await fetch(url, { ...options, headers });
    const data = await response.json(); // Parses the JSON response body
    if (!response.ok) {
      throw new Error(data.message || 'Request failed'); // Throws an error if the response is not OK
    }
    return data; // Returns the parsed data
  }

  // Methods for user authentication, including login, signup, and logout
  async loginUser(username, password) {
    return await this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      credentials: 'include', // Necessary for cookies if using sessions
    });
  }

  async signupUser(username, password) {
    return await this.request('/users/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });
  }

  async logoutUser() {
    return await this.request('/users/logout', {
      method: 'GET',
      credentials: 'include',
    });
  }

  // Task management methods, including fetching, creating, deleting, and updating tasks
  async fetchTasks() {
    return await this.request('/tasks/', { method: 'GET' });
  }

  async createTask(taskData) {
    return await this.request('/tasks/', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }
  
  async deleteTask(taskId) {
    return await this.request(`/tasks/${taskId}`, { method: 'DELETE' });
  }

  async updateTask(taskId, taskData) {
    return await this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  // Column management methods, including fetching, adding, and deleting columns
  async fetchColumns() {
    return await this.request('/columns/', { method: 'GET' });
  }

  async addColumn(columnData) {
    return await this.request('/columns/', {
      method: 'POST',
      body: JSON.stringify(columnData),
    });
  }

  async deleteColumn(columnId) {
    return await this.request(`/columns/${columnId}`, { method: 'DELETE' });
  }
}

// Example usage
const API_BASE_URL = 'http://127.0.0.1:5000'; // Specifies the API's base URL
const apiClient = new CustomApiClient(API_BASE_URL); // Instantiates the API client

export default apiClient; // Exports the instantiated API client for use throughout the application
