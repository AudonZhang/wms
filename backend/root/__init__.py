from flask import Blueprint

# 创建用户模块的蓝图
root_blue = Blueprint('root', __name__, url_prefix='/api/root')

from . import views
