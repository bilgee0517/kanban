# Project Overview: Task Management Application

The Task Management Application is a comprehensive solution designed to streamline task organization and project management through a visually intuitive board interface. This application combines the power of modern web technologies, including React for the frontend and Flask for the backend, to deliver a seamless user experience that enables individuals and teams to manage tasks efficiently.

## Key Features
### User Authentication
The application supports full user authentication, including sign-up, login, and logout functionalities. Utilizing JWT (JSON Web Tokens) for secure authentication, users can create personal accounts to access and manage their tasks. The authentication logic is implemented in the backend with Flask, leveraging the werkzeug.security module for password hashing and verification, and in the frontend through React components, such as AuthPage.js, that interface with the custom API client for authentication requests.

### Dynamic Task and Column Management

At the core of the application lies the dynamic management of tasks and columns. Users can create, update, and delete tasks and columns, allowing for complete customization of their board. Each task can be assigned to a column representing different stages, and tasks can be nested to support sub-tasks for detailed project management. The frontend logic for these features is encapsulated in React components (Columns.js, Tasks.js, TaskItem.js, AddNewColumn.js, and AddTask.js), while the backend logic is handled by Flask routes and SQLAlchemy models (models.py for database models and resources/ for API endpoints).

### Drag-and-Drop Interface

Enhancing user interaction, the application incorporates a drag-and-drop interface for tasks, enabled by react-dnd. This feature allows users to intuitively move tasks across columns, reflecting changes in task status or priority with simple drag actions. The implementation of this feature is found within the TaskItem.js component, utilizing the useDrag and useDrop hooks from react-dnd.

### Real-time Task Updates

To ensure that the board always reflects the latest state, the application is designed to fetch real-time updates for tasks and columns. This is achieved through the useEffect hook in React, which calls the custom API client to fetch the latest data from the backend upon component mount or specific state changes. The TasksProvider component in TasksContext.js centralizes the state management for tasks and columns, providing a context that any component can access to retrieve or update the state.

### API-Driven Architecture
The backend API, developed with Flask, exposes endpoints for managing users, tasks, and columns (/users, /tasks, /columns). The CustomApiClient class in the frontend (apiClient.js) abstracts the communication with these endpoints, providing a clean interface for the React components to interact with the backend. This decouples the frontend from the backend logic, making the application more maintainable and scalable.

### Secure and Scalable Backend
The Flask backend utilizes SQLAlchemy for ORM, providing a secure and efficient way to interact with the database. The application's structure follows best practices for scalability, with separate models (models.py), resources (resources/), and services (api/) to handle different aspects of the application logic. User passwords are securely hashed, and JWT tokens are used for secure sessions.

### Responsive and Accessible UI

Built with React Bootstrap, the application's UI is responsive and accessible, ensuring a consistent and user-friendly experience across devices. The use of Container, Stack, Tabs, and Button components from React Bootstrap contributes to a modern and clean interface that is easy to navigate.

### Comprehensive State Management

The application leverages React's Context API and hooks for state management, encapsulating global state in the TasksContext. This allows for efficient state updates and access across components, facilitating features like adding a new task, deleting a task, and updating task details without unnecessary prop drilling or component re-renders.

## Development and Deployment

The project's codebase is organized into two main directories: src/ for the frontend and api/ for the backend, promoting separation of concerns and ease of maintenance. The Flask application serves the API, while the React application, created with Create React App, consumes the API, enabling a decoupled architecture that simplifies deployment and development.

## Conclusion
The Kanban Task Management Application is a robust solution that addresses the needs of project management and task tracking through a user-friendly web interface. It combines the efficiency of Flask and SQLAlchemy in the backend with the flexibility and interactivity of React in the frontend. With features like user authentication, dynamic task and column management, a drag-and-drop interface, and real-time updates, the application stands as a testament to modern web development practices, offering scalability, security, and a seamless user experience.


## Installation
As part of your submission you must include a Zip file with all the necessary code and dependencies (eg. requirements.txt), and a README.md file. To get your application to run should only require the following steps:

Flask on macOS:

```bash
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
python3 run.py
```

Flask on Windows:

```bash
python3 -m venv venv
venv\Scripts\activate.bat
pip3 install -r requirements.txt
python3 run.py
Node.js:
```

Node.js:

```bash
npm install
npm start
```

Demo video: https://www.loom.com/share/cd80d98287194436b25f18489c2cf591?sid=ec7f7481-a8ff-440a-bbf0-efa5cc6ef6eb
