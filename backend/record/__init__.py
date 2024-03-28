from flask import Blueprint

# 创建出入库记录模块的蓝图
record_blue = Blueprint('record', __name__, url_prefix='/api/record')

from . import views
