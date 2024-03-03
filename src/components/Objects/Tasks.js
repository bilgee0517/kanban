import React, { useState, useEffect, useContext } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { TasksContext } from '../../Services/TasksContext'; // Import the context to access tasks globally
import TaskItem from './TaskItem'; // Import the TaskItem component to render each task

// The Tasks component receives column_id and onAddSubtask as props
export default function Tasks({ column_id, onAddSubtask }) {
  const { tasks, fetchTasks } = useContext(TasksContext); // Destructure tasks and fetchTasks from context
  const [filteredhighlevel, setFilteredhighlevel] = useState([]); // State to hold tasks filtered by column and without a parent_id
  const [expandedTaskIds, setExpandedTaskIds] = useState(new Set()); // State to track expanded tasks for showing subtasks

  useEffect(() => {
    fetchTasks(); // Call fetchTasks on component mount or when fetchTasks changes to refresh the tasks list
  }, [fetchTasks]); // Dependency array includes fetchTasks to ensure it runs when this function changes
  
  useEffect(() => {
    // Filter tasks by column_id and ensure they are top-level tasks (i.e., tasks without a parent_id)
    const filtered = tasks.filter(task => task.column_id === column_id && !task.parent_id);
    setFilteredhighlevel(filtered); // Update the state with the filtered tasks
  }, [tasks, column_id]); // Dependency array includes tasks and column_id to re-filter when these change

  // Handler for task item clicks to toggle the expanded state, showing or hiding subtasks
  const handleTaskClick = (event, taskId) => {
    event.stopPropagation(); // Prevent event from bubbling up to avoid unintended clicks
    setExpandedTaskIds(prevIds => {
      const newIds = new Set(prevIds); // Create a new Set from the previous state to ensure immutability
      if (newIds.has(taskId)) {
        newIds.delete(taskId); // If the task is already expanded, remove it from the Set
      } else {
        newIds.add(taskId); // If the task is not expanded, add it to the Set
      }
      return newIds; // Return the updated Set as the new state
    });
  };

  return (
    <Container className='tasks'>
      {/* Map over the filteredhighlevel array to render TaskItem components for each task */}
      {filteredhighlevel.map(task => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onAddSubtask={onAddSubtask} // Propagate the onAddSubtask handler to each TaskItem
          onTaskClick={handleTaskClick} // Propagate the onTaskClick handler to each TaskItem
          expandedTaskIds={expandedTaskIds} // Pass down the Set of expanded task IDs to control the visibility of subtasks
          tasks={tasks} // Pass down the full list of tasks for subtask rendering
        />
      ))}
    </Container>
  );
}
