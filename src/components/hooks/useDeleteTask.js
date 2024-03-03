import { useContext } from 'react';
import { TasksContext } from '../../Services/TasksContext';

// Custom hook for deleting a task
export const useDeleteTask = () => {
  const { deleteTask } = useContext(TasksContext); // Access deleteTask function from context

  const handleDeleteTask = (taskId) => {
    // Confirm with the user before deletion
    if (window.confirm("Are you sure you want to delete this task?")) {
      // If confirmed, call the deleteTask function from context
      deleteTask(taskId);
    }
  };

  return handleDeleteTask; // Return the handler function
};
