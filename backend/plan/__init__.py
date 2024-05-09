from flask import Blueprint

# Create a blueprint for the plan module
plan_blue = Blueprint('plan', __name__, url_prefix='/api/plan')

from . import views
