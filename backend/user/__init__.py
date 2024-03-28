from flask import Blueprint

# 创建用户模块的蓝图
user_blue = Blueprint('user', __name__, url_prefix='/api/user')

from . import views
