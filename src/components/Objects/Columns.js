import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Tasks from './Tasks'; // Component that renders tasks within this column
import AddTask from '../AddTask'; // Component for adding a new task
import { Button } from 'react-bootstrap'; // Bootstrap component for buttons
import { useDrop } from 'react-dnd'; // Hook from react-dnd for drag-and-drop functionality
import { TasksContext } from '../../Services/TasksContext'; // Context for tasks
import { useAddTaskModal } from '../hooks/useAddTaskModal'; // Custom hook for managing the add task modal state
import { useDeleteColumn } from '../hooks/useDeleteColumn'; // Custom hook for deleting a column

export default function Column({ title, column_id }) {
  const { updateTask } = useContext(TasksContext); // Access the updateTask function from context
  const { showModal, parentId, handleOpenModal, handleCloseModal } = useAddTaskModal(); // Destructure modal-related values and functions from the useAddTaskModal hook
  const deleteColumn = useDeleteColumn(); // Hook to handle column deletion logic

  // Setup for the react-dnd drop functionality
  const [, drop] = useDrop({
    accept: "task", // Accepts drag items of type "task"
    drop: (item, monitor) => {
      // Handles task drop events, updating the task's column
      updateTask(item.id, { 'parent_id': null, 'column_id': column_id });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(), // Collects the isOver state to indicate if a draggable item is over this drop target
    }),
  });

  return (
    // Stack components for vertical and horizontal layout
    <Stack direction="vertical" className="columns-container">
      <Stack direction="horizontal" className="kanban-header">
        <Container className="kanban-title"><h2>{title}</h2></Container>
        <Button variant="danger" size='sm' onClick={() => deleteColumn(column_id)}>x</Button> {/* Button to delete the column */}
      </Stack>
      <Container ref={drop} className="kanban-column"> {/* Drop target setup for drag-and-drop */}
        <Container className='kanban-content'>
          {/* Renders tasks within this column. */}
          <Tasks column_id={column_id} onAddSubtask={(parentId) => handleOpenModal(parentId)} />
          {/* Conditionally renders the AddTask modal if showModal is true. */}
          {showModal && (
            <AddTask
              show={showModal}
              handleClose={handleCloseModal}
              parentId={parentId}
              column_id={column_id} 
            />
          )}
        </Container>
        {/* Button to open the modal for adding a new task */}
        <Button variant="primary" onClick={() => handleOpenModal()} style={{ margin: '10px' }}>
          Add Task
        </Button>
      </Container>
    </Stack>
  );
}
