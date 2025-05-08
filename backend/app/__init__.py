from flask import Flask
from flask_cors import CORS
from .routes import upload_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['UPLOAD_FOLDER'] = './uploads/images'
    app.register_blueprint(upload_bp) #ini namanya hrs sama kyk di routes.py

    return app
