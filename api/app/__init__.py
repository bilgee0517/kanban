from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_restx import Api
from flask_cors import CORS
from config import Config

# Initialize the extensions without specific app
db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app, supports_credentials=True)
    db.init_app(app)
    jwt.init_app(app)

    app.config['JWT_SECRET_KEY'] = 'secret' 

    # Import resources here to avoid circular imports
    from app.resources.tasks import ns as tasks_ns
    from app.resources.users import user_ns as users_ns
    from app.resources.columns import ns as columns_ns 

    api = Api(app, version='1.0', title='Task API', description='A simple Task Management API')
    api.add_namespace(tasks_ns, path='/tasks')
    api.add_namespace(users_ns, path='/users')
    api.add_namespace(columns_ns, path='/columns')

    with app.app_context():
        db.create_all()

    return app
