from flask import Blueprint

# creata blueprint user
user_blue = Blueprint('user', __name__, url_prefix='/api/user')

from . import views
