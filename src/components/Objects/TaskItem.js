import React from 'react';
import { useDrag, useDrop } from 'react-dnd'; // Import hooks from react-dnd for drag-and-drop functionality
import { TasksContext } from '../../Services/TasksContext'; // Import the context to access task operations
import { useContext } from 'react';
import { useDeleteTask } from '../hooks/useDeleteTask'; // Custom hook for deleting tasks
import { Container, Button } from 'react-bootstrap'; // Bootstrap components for styling

const TaskItem = ({ task, onAddSubtask, onTaskClick, expandedTaskIds, tasks, updateTaskParent }) => {
  const {updateTask} = useContext(TasksContext); // Access the updateTask function from context
  const deleteTask = useDeleteTask(); // Hook to handle task deletion

  // Setup for draggable task items
  const [, drag] = useDrag(() => ({
    type: 'task', // Define drag type as 'task'
    item: { id: task.id }, // Data being dragged (task ID)
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // Monitor dragging state
    }),
  }));

  // Setup for droppable areas within tasks (for nesting tasks as subtasks)
  const [{ isOver }, drop] = useDrop({
    accept: 'task', // Accepts drop items of type 'task'
    drop: (item, monitor) => {
      if (item.id !== task.id) {
        // Prevent a task from being dropped onto itself
        updateTask(item.id,{'parent_id':task.id}); // Update the parent_id to nest the task as a subtask
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(), // Track whether a draggable item is over this drop target
    }),
  });

  return (
    <Container ref={drop} className='task-item' style={{ opacity: isOver ? 0.5 : 1 }} onClick={(event) => onTaskClick(event, task.id)}>
      <Container ref={drag} style={{ cursor: 'move' }}> {/* Apply the drag ref here */}
        <h4>{task.title}</h4> {/* Display the task title */}
        {/* If the task is expanded, recursively render its subtasks */}
        {expandedTaskIds.has(task.id) && tasks.filter(child => child.parent_id === task.id).map(child => (
          <TaskItem 
              key={child.id}
              task={child}
              onAddSubtask={onAddSubtask}
              onTaskClick={onTaskClick}
              expandedTaskIds={expandedTaskIds}
              tasks={tasks}
              updateTaskParent={updateTaskParent}
          />
        ))}
        <Container className="task-actions">
          {/* Button to add a subtask */}
          <Button variant='success' onClick={() => onAddSubtask(task.id)}> Add Subtask</Button>
          {/* Button to delete the task */}
          <Button variant="danger" onClick={() => deleteTask(task.id)}>Delete Task</Button>
        </Container>
      </Container>
    </Container> 
  );
};

export default TaskItem;
