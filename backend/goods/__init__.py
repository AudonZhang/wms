from flask import Blueprint

# Create a blueprint for the goods module
goods_blue = Blueprint('goods', __name__, url_prefix='/api/goods')

from . import views
