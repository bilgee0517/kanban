import React, { useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap'; // Import necessary components from react-bootstrap for UI
import { TasksContext } from '../Services/TasksContext'; // Import the context to use the addColumn function

const AddNewColumn = ({ show, handleClose }) => {
  const [newColumnName, setNewColumnName] = useState(''); // State to hold the input value for the new column name
  const { addColumn } = useContext(TasksContext); // Destructure addColumn function from context

  const handleAddColumn = () => {
    if (!newColumnName.trim()) {
      // Prevent adding empty column names
      alert("Column name can't be empty");
      return;
    }
    addColumn({ name: newColumnName.trim() }); // Call the addColumn function with the new column name
    handleClose(); // Close the modal after adding the column
    setNewColumnName(''); // Reset the input field to empty
  };

  return (
    <Modal show={show} onHide={handleClose}> {/* Modal component to show or hide based on the show prop */}
      <Modal.Header closeButton> {/* Modal header with a close button */}
        <Modal.Title>Add a New Column</Modal.Title> {/* Modal title */}
      </Modal.Header>
      <Modal.Body> {/* Modal body containing the form */}
        <Form onSubmit={(e) => e.preventDefault()}> {/* Form to capture the new column name */}
          <Form.Group> {/* Form group for better form control styling */}
            <Form.Label>Column Name</Form.Label> {/* Label for the input field */}
            <Form.Control
              type="text"
              placeholder="Enter column name"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer> {/* Modal footer containing action buttons */}
        <Button variant="secondary" onClick={handleClose}> {/* Button to close the modal */}
          Close
        </Button>
        <Button variant="primary" onClick={handleAddColumn}> {/* Button to save the new column */}
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNewColumn; // Export the component for use in other parts of the application
