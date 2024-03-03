import React, { createContext, useContext, useState, useCallback } from 'react';
import apiClient from './apiClient'; // Import the API client for making requests to the backend

export const TasksContext = createContext(); // Create a React context for tasks

export const useTasks = () => useContext(TasksContext); // Custom hook to use the TasksContext

export const TasksProvider = ({ children }) => {
  // State for tasks and columns
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);

  // Fetch tasks from the server and update the state
  const fetchTasks = useCallback(async () => {
    try {
      const fetchedTasks = await apiClient.fetchTasks(); // Use the API client to fetch tasks
      setTasks(fetchedTasks || []); // Update state or set to an empty array if undefined
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]); // Reset tasks on error
    }
  }, []); 

  // Add a new task using the API client, then update the local state
  const addTask = async (taskData) => {
    try {
      const newTask = await apiClient.createTask(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]); // Append the new task to the current tasks array
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Delete a task by ID, then update the local state to exclude the deleted task
  const deleteTask = async (taskId) => {
    try {
      await apiClient.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId)); // Filter out the deleted task
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Update a task by ID, then replace the task in the local state with the updated task
  const updateTask = useCallback(async (taskId, taskData) => {
    try {
      const updatedTask = await apiClient.updateTask(taskId, taskData);
      setTasks((prevTasks) => prevTasks.map(task => task.id === taskId ? updatedTask : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }, []);

  // Fetch columns from the server and update the state
  const fetchColumns = useCallback(async () => {
    try {
      const fetchedColumns = await apiClient.fetchColumns();
      setColumns(fetchedColumns || []);
    } catch (error) {
      console.error('Error fetching columns:', error);
      setColumns([]);
    }
  }, []);

  // Add a new column using the API client, then update the local state
  const addColumn = useCallback(async (columnData) => {
    try {
      const newColumn = await apiClient.addColumn(columnData);
      setColumns((prevColumns) => [...prevColumns, newColumn]);
    } catch (error) {
      console.error('Error adding column:', error);
    }
  }, []);

  // Delete a column by ID, then update the local state to exclude the deleted column
  const deleteColumn = useCallback(async (columnId) => {
    try {
      await apiClient.deleteColumn(columnId);
      setColumns((prevColumns) => prevColumns.filter((column) => column.id !== columnId));
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  }, []);

  // Provide the state and state-updating functions to the context
  return (
    <TasksContext.Provider value={{
      tasks, columns, fetchTasks, addTask, deleteTask, updateTask, refreshTasks: fetchTasks,
      fetchColumns, deleteColumn, addColumn
    }}>
      {children} 
    </TasksContext.Provider>
  );
};
