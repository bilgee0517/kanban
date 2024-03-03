import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const TaskForm = ({ show, handleClose, handleSubmit, title, setTitle, description, setDescription, parentId }) => {
  return (
    <Modal show={show} onHide={handleClose} className="add-task-modal">
      <Modal.Header closeButton>
        <Modal.Title>{parentId ? 'Add New Subtask' : 'Add New Task'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add {parentId ? 'Subtask' : 'Task'}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskForm;
