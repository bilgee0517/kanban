from flask_restx import Namespace, Resource, fields
from flask import request, jsonify  # Ensure jsonify is imported for the delete response
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.models import Task, TaskColumn
from app import db

# Namespace for column-related operations
ns = Namespace('columns', description='Columns operations')

# Model for API documentation and validation for listing and returning columns
columns_model = ns.model('Columns', {
    'id': fields.Integer(required=True, description='The column unique identifier'),
    'name': fields.String(required=True, description='The name of the column'),
    'user_id': fields.Integer(required=True, description='The ID of the user owning the column')
})

# Model for creating a new column with validation
columns_creation_model = ns.model('ColumnCreation', {
    'name': fields.String(required=True, description='The name of the column'),
})


@ns.route('/')
class ColumnList(Resource):
    @jwt_required()
    @ns.doc('list_columns')
    @ns.marshal_list_with(columns_model)
    def get(self):
        '''Lists all columns for the authenticated user'''
        current_user_id = get_jwt_identity()
        user_columns = TaskColumn.query.filter_by(user_id=current_user_id).all()  # Query columns for current user
        return user_columns

    @jwt_required()
    @ns.doc('create_column')  # Documentation for creating a new column
    @ns.expect(columns_creation_model)  # Expecting the model for column creation
    @ns.marshal_with(columns_model, code=201)  # Return the created column model
    def post(self):
        '''Creates a new column for the authenticated user'''
        current_user_id = get_jwt_identity()
        data = request.json  # Extract data from request
        new_column = TaskColumn(name=data['name'], user_id=current_user_id)  # Create new column object
        db.session.add(new_column)  # Add new column to the database session
        db.session.commit()  # Commit the transaction
        return new_column, 201  # Return the created column and HTTP status 201

@ns.route('/<int:column_id>')
@ns.param('column_id', 'The column identifier')  # Parameter for specific column operations
class ColumnResource(Resource):
    @jwt_required()
    @ns.doc('delete_column')  # Documentation for deleting a column
    def delete(self, column_id):
        '''Deletes a column and all tasks within it for the authenticated user'''
        current_user_id = get_jwt_identity()

        # Find the column by ID and user ID to ensure it belongs to the current user
        column = TaskColumn.query.filter_by(id=column_id, user_id=current_user_id).first()
        if not column:
            ns.abort(404, message="Column not found")  # Column not found or does not belong to user
        
        # Find all tasks within the column to delete them
        tasks_in_column = Task.query.filter_by(column_id=column_id, user_id=current_user_id).all()
        for task in tasks_in_column:
            db.session.delete(task)  # Delete each task found in the column

        db.session.delete(column)  # Delete the column after deleting all tasks within it
        db.session.commit()  # Commit the changes to the database

        return {'message': 'Column and all associated tasks deleted'}, 200  # Confirmation message
