from flask import Blueprint

# Create a blueprint for the user module
user_blue = Blueprint('user', __name__, url_prefix='/api/user')

from . import views
