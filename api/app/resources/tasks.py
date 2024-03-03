from flask_restx import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.models import Task 
from app import db

# Namespace for task-related operations
ns = Namespace('tasks', description='Task operations')

# Model for creating a task
task_creation_model = ns.model('TaskCreation', {
    'title': fields.String(required=True, description='The task title'),
    'description': fields.String(required=False, description='The task description'),
    'column_id': fields.Integer(required=True, description='The ID of the task column'),
    'parent_id': fields.Integer(required=False, description='The parent task ID if any')
})

# Model for task representation, including read-only fields
task_model = ns.clone('Task', task_creation_model, {
    'id': fields.Integer(readonly=True, description='The task unique identifier'),
    'user_id': fields.Integer(readonly=True, description='The ID of the user who owns the task'),
    'parent_id': fields.Integer(readonly=True, description='The parent task ID, for sub-tasks')
})

# Endpoint for listing and creating tasks
@ns.route('/')
class TaskList(Resource):
    @jwt_required()
    @ns.doc('list_tasks')
    @ns.marshal_list_with(task_model)
    def get(self):
        '''Lists all tasks for the current user.'''
        current_user_id = get_jwt_identity()
        tasks = Task.query.filter_by(user_id=current_user_id).all()
        return tasks

    @jwt_required()
    @ns.doc('create_task')
    @ns.expect(task_creation_model)
    @ns.marshal_with(task_model, code=201)
    def post(self):
         # Import Task and TaskColumn models
        '''Creates a new task for the current user.'''
        current_user_id = get_jwt_identity()
        data = request.json
        task = Task(
            user_id=current_user_id,
            title=data['title'],
            description=data.get('description'),
            column_id=data.get('column_id'),
            parent_id=data.get('parent_id')
        )
        db.session.add(task)  # Add the new task to the database
        db.session.commit()  # Commit the transaction
        return task, 201

# Endpoint for specific task operations (delete, update)
@ns.route('/<int:task_id>')
@ns.response(404, 'Task not found')
@ns.param('task_id', 'The task unique identifier')
class TaskResource(Resource):
    @jwt_required()
    @ns.doc('delete_task')
    def delete(self, task_id):
        '''Deletes a task and its sub-tasks.'''
        current_user_id = get_jwt_identity()
        task = Task.query.filter_by(user_id=current_user_id, id=task_id).first()
        
        if not task:
            return {'message': 'Task not found'}, 404

        # Recursive function to delete task and its children
        def delete_task_and_children(task_to_delete):
            children = Task.query.filter_by(parent_id=task_to_delete.id).all()
            for child in children:
                delete_task_and_children(child)  # Recursively delete each child
            db.session.delete(task_to_delete)  # Delete the task

        delete_task_and_children(task)  # Start the deletion process
        db.session.commit()
        return {'message': 'Task and all subtasks deleted'}, 200
    
    @jwt_required()
    @ns.doc('update_task')
    @ns.expect(task_creation_model)
    @ns.marshal_with(task_model)
    def put(self, task_id):
        '''Updates an existing task.'''
        current_user_id = get_jwt_identity()
        task = Task.query.filter_by(user_id=current_user_id, id=task_id).first()
        
        if not task:
            ns.abort(404, "Task not found")

        data = request.json
        task.title = data.get('title', task.title)
        task.description = data.get('description', task.description)
        task.column_id = data.get('column_id', task.column_id)
        task.parent_id = data.get('parent_id', task.parent_id)
        
        db.session.commit()  # Commit the updates
        return task
