import React, { useState } from 'react';
import { useAddTask } from './hooks/useAddTask'; // Custom hook for adding a task
import TaskForm from './Objects/TaskForm'; // Component for the task form UI

// The AddTask component receives props to control its display and to specify where the task should be added
export default function AddTask({ show, handleClose, parentId, column_id }) {
  const [title, setTitle] = useState(''); // State for the task's title
  const [description, setDescription] = useState(''); // State for the task's description
  const handleSubmitTask = useAddTask(); // Use the custom hook to get the function for submitting a task

  // Function to handle the form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from causing a page reload

    // Prepare the task data from the state and props
    const taskData = { title, description, column_id, parent_id: parentId };
    // Use the custom hook's function to submit the task
    await handleSubmitTask(taskData, () => {
      // Success callback function
      setTitle(''); // Reset the title state
      setDescription(''); // Reset the description state
      handleClose(); // Close the form modal
    });
  };

  // Render the TaskForm component with the current state and handlers
  return (
    <TaskForm
      show={show} // Prop to control the display of the form
      handleClose={handleClose} // Handler to close the form
      handleSubmit={handleSubmit} // Handler for form submission
      title={title} // Current title state
      setTitle={setTitle} // Setter for the title state
      description={description} // Current description state
      setDescription={setDescription} // Setter for the description state
      column_id={column_id} // ID of the column where the task will be added
      parentId={parentId} // ID of the parent task, if this is a subtask
    />
  );
}
