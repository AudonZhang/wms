from flask import Blueprint

# creata blueprint record
goods_blue = Blueprint('goods', __name__, url_prefix='/api/goods')

from . import views
