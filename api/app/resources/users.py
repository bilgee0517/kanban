from flask_restx import Namespace, Resource, fields
from werkzeug.security import generate_password_hash, check_password_hash
from flask import request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.models import User
from app import db

# Namespace for user operations, providing a way to organize and access endpoints
user_ns = Namespace('users', description='User operations')

# Model representation for Swagger UI, defining the structure of a User object
user_model = user_ns.model('User', {
    'id': fields.Integer(readonly=True, description='The user unique identifier'),
    'username': fields.String(required=True, description='The username'),
    # Define other fields as needed, but exclude the password for security reasons
})

# Endpoint for user signup
@user_ns.route('/signup')
class UserSignup(Resource):
    @user_ns.expect(user_model, validate=True)  # Expecting a user model, with validation
    def post(self):
        '''Create a new user'''
        data = request.json
        username = data.get('username')
        password = data.get('password')

        # Check if the username already exists
        user = User.query.filter_by(username=username).first()
        if user:
            return {'message': 'Username already exists'}, 400
        
        # If the username is new, hash the password and create a new user
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password_hash=hashed_password)
        db.session.add(new_user)  # Add the new user to the database session
        db.session.commit()  # Commit the session to save changes
        return {'message': 'User created successfully'}, 201

# Endpoint for user login
@user_ns.route('/login')
class UserLogin(Resource):
    @user_ns.doc('login_user')  # Documentation specifics for this endpoint
    def post(self):
        '''Authenticate a user and return JWT token'''
        data = request.get_json()  # Extracting JSON data from the request

        username = data.get('username')
        password = data.get('password')
        if not username or not password:
            return {'message': 'Username and password are required'}, 400

        # Verify username and password
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            # If credentials are correct, create and return a JWT token
            access_token = create_access_token(identity=user.id)
            return {'access_token': access_token}, 200
        else:
            # If credentials are incorrect, return an error
            return {'message': 'Invalid username or password'}, 401

# Endpoint for user logout
@user_ns.route('/logout')
class UserLogout(Resource):
    @jwt_required()  # Requires a valid JWT to access
    def get(self):
        '''Logout a user (JWT token not needed for logout)'''
        # For JWT, logout is handled client-side by discarding the token, so just return a message
        return {'message': 'User logged out successfully'}, 200
