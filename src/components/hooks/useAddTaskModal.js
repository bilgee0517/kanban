import { useState } from 'react';

// Custom hook for managing the add task modal's visibility and state
export const useAddTaskModal = () => {
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [parentId, setParentId] = useState(null); // State to store the parent ID for nested tasks

  const handleOpenModal = (newParentId = null) => {
    // Function to open the modal and optionally set a parent ID for the new task
    setShowModal(true);
    setParentId(newParentId);
  };

  const handleCloseModal = () => {
    // Function to close the modal and reset the parent ID
    setShowModal(false);
    setParentId(null);
  };

  return {
    showModal,
    parentId,
    handleOpenModal,
    handleCloseModal,
  };
};
