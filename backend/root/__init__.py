from flask import Blueprint

# Create a blueprint for the root module
root_blue = Blueprint('root', __name__, url_prefix='/api/root')

from . import views
