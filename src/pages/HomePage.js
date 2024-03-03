import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'; // Bootstrap container for layout
import Stack from 'react-bootstrap/Stack'; // Bootstrap stack for arranging items
import Columns from '../components/Objects/Columns'; // Columns component to display each column of tasks
import Header from '../components/Objects/Header'; // Header component for the top of the page
import AddNewColumn from '../components/addNewColumn'; // Component to add a new column
import { useTasks } from '../Services/TasksContext'; // Custom hook to access tasks context
import { Button } from 'react-bootstrap'; // Button component from React Bootstrap
import { DndProvider } from 'react-dnd'; // Context provider for React DnD
import { HTML5Backend } from 'react-dnd-html5-backend'; // HTML5 backend for React DnD

export default function HomePage() {
  const { columns, fetchColumns } = useTasks(); // Destructure columns and fetchColumns from the tasks context
  const [showModal, setShowModal] = useState(false); // State to control the visibility of the AddNewColumn modal

  // Fetch columns from the backend when the component mounts
  useEffect(() => {
    fetchColumns();
  }, [fetchColumns]); // Dependency array includes fetchColumns to ensure effect runs only when fetchColumns changes

  return (
    // DndProvider wraps the entire container to provide drag-and-drop functionality
    <DndProvider backend={HTML5Backend}>
      <Container>
        <Header /> {/* Render the Header component */}
        <Stack direction="horizontal" className="Body" gap={0}>
          {/* Map over the columns array to render a Columns component for each column */}
          {columns.map((column) => (
            <Container key={column.id}>
              {/* Pass the column title and id as props to the Columns component */}
              <Columns title={column.name} column_id={column.id} />
            </Container>
          ))}
          {/* Button to open the AddNewColumn modal */}
          <Button onClick={() => setShowModal(true)} className='add_column'>Add Column</Button>
        </Stack>
        {/* Render the AddNewColumn modal, passing the showModal state and a function to close the modal */}
        <AddNewColumn show={showModal} handleClose={() => setShowModal(false)} />
      </Container>
    </DndProvider>
  );
}
