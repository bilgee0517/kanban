from app import db
from werkzeug.security import generate_password_hash, check_password_hash

# Define a Task model to represent each task in the Kanban board
class Task(db.Model):
    __tablename__ = 'task'  # Table name in the database
    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each task
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key linking task to a user
    title = db.Column(db.String(128), nullable=False)  # Task title
    description = db.Column(db.String(256), nullable=True)  # Optional task description
    column_id = db.Column(db.Integer, db.ForeignKey('task_column.id'), nullable=True)  # Foreign key linking task to its column
    parent_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=True)  # Optional parent task ID for sub-tasks

    # Establish a self-referential relationship for tasks that can have sub-tasks
    children = db.relationship('Task', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')

    # Note: The backref for the column is defined in the TaskColumn model

# Define a User model to represent users in the application
class User(db.Model):
    __tablename__ = 'user'  # Table name in the database
    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each user
    username = db.Column(db.String(80), unique=True, nullable=False)  # User's username, must be unique
    password_hash = db.Column(db.String(120), nullable=False)  # Hashed password for security

    # Establish a relationship with Task, allowing access to a user's tasks
    tasks = db.relationship('Task', backref='user', lazy=True)

    # Establish a relationship with TaskColumn, allowing access to a user's columns
    columns = db.relationship('TaskColumn', back_populates='user', lazy='dynamic')  # A user can have multiple columns

    # Method to set a user's password, automatically hashing it for security
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Method to verify a given password against the stored hash
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Define a TaskColumn model to represent columns in the Kanban board (e.g., Todo, Doing, Done)
class TaskColumn(db.Model):
    __tablename__ = 'task_column'  # Table name in the database
    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each column
    name = db.Column(db.String(50), nullable=False)  # Column name (e.g., Todo, Doing, Done)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key linking column to a user

    # Establish a relationship with User, indicating which user a column belongs to
    user = db.relationship('User', back_populates='columns')

    # Establish a relationship with Task, indicating tasks that belong to this column
    tasks = db.relationship('Task', backref='task_column', lazy=True)  # Each column can contain multiple tasks
