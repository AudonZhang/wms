from flask import Blueprint

# Create a blueprint for the record module
record_blue = Blueprint('record', __name__, url_prefix='/api/record')

from . import views
