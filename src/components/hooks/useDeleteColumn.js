import { useContext } from 'react';
import { TasksContext } from '../../Services/TasksContext';

// Custom hook for deleting a column
export const useDeleteColumn = () => {
  const { deleteColumn } = useContext(TasksContext); // Access deleteColumn function from context

  const handleDeleteColumn = async (columnId) => {
    // Confirm with the user before deletion
    const confirmDelete = window.confirm("Are you sure you want to delete this column?");
    if (confirmDelete) {
      // If confirmed, call the deleteColumn function from context
      await deleteColumn(columnId);
    }
  };

  return handleDeleteColumn; // Return the handler function
};
