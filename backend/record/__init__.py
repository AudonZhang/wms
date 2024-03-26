from flask import Blueprint

# creata blueprint record
record_blue = Blueprint('record', __name__, url_prefix='/api/record')

from . import views
