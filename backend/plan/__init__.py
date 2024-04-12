from flask import Blueprint

# 创建出入库记录计划的蓝图
plan_blue = Blueprint('plan', __name__, url_prefix='/api/plan')

from . import views
