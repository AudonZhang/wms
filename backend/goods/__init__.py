from flask import Blueprint

# 创建货物模块的蓝图
goods_blue = Blueprint('goods', __name__, url_prefix='/api/goods')

from . import views
