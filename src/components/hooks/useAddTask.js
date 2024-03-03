import { useContext } from 'react';
import { TasksContext } from '../../Services/TasksContext';

// Custom hook for adding a new task
export const useAddTask = () => {
  const { addTask, refreshTasks } = useContext(TasksContext); // Access addTask and refreshTasks functions from context

  const handleSubmitTask = async (taskData, onSuccess) => {
    // Function to submit new task data
    try {
      await addTask(taskData); // Attempt to add a new task
      await refreshTasks(); // Refresh the tasks list to include the new task
      onSuccess(); // Execute any success callback, such as closing a modal or resetting a form
    } catch (error) {
      // Log any errors to the console
      console.error('Error adding task:', error);
    }
  };

  return handleSubmitTask; // Return the handler function
};
