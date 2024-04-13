from flask import jsonify, request, json
from plan import plan_blue
from func.plans import Plan
from func.goods import Goods
import logging
from datetime import datetime


# 错误日志
logging.basicConfig(filename="api.log", level=logging.DEBUG)


# 获取所有计划信息的路由
@plan_blue.route('/get_all_plans')
def get_all_plans():
    try:
        result = Plan.get_all_plans()
        logging.info("获得所有计划信息")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "Error occurred while getting all plans from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# 获取所有无出库计划的货物的路由
@plan_blue.route('/get_all_out_plan_goods')
def get_all_out_plan_goods():
    try:
        planResult = Plan.get_all_out_plans()
        goodsResult = Goods.get_all_goods()
        out_plan_goods_list = []
        for goods in goodsResult:
            if goods['goodsAmount'] == 0:
                continue
            for plan in planResult:
                if (
                    plan['inOrOutbound'] == 'Outbound'
                    and plan['planGoodsID'] == goods['goodsID']
                    and plan['planStatus'] == '未完成'
                ):
                    goods['goodsAmount'] -= plan['planExpectedAmount']
            if goods['goodsAmount'] <= 0:
                continue
            out_plan_goods_list.append(
                {
                    'goodsID': goods['goodsID'],
                    'goodsName': goods['goodsName'],
                    'goodsSpecification': goods['goodsSpecification'],
                    'goodsManufacturer': goods['goodsManufacturer'],
                    'goodsProductionLicense': goods['goodsProductionLicense'],
                    'goodsUnit': goods['goodsUnit'],
                    'goodsAmount': goods['goodsAmount'],
                    'goodsStorageCondition': goods['goodsStorageCondition'],
                    'goodsUpdatedByID': goods['goodsUpdatedByID'],
                    'goodsUpdatedTime': goods['goodsUpdatedTime'],
                }
            )
        return jsonify(out_plan_goods_list)
    except Exception as e:
        logging.error(
            "Error occurred while getting all out goods from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# 新增计划的路由
@plan_blue.route('/add_plan', methods=['GET', 'POST'])
def add_plan():
    try:
        if request.method == 'POST':
            data = json.loads(request.get_data())
            result = Plan.add_plan(
                data['planID'],
                data['inOrOutbound'],
                data['planGoodsID'],
                datetime.strptime(data['planExpectedTime'], '%a, %d %b %Y %H:%M:%S %Z'),
                data['planExpectedAmount'],
                data['planStatus'],
                data['planUpdatedByID'],
                datetime.now(),
                None,
                None,
            )
            return jsonify(result)
        else:
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error(
            'Error occurred while adding plan. Error message: {}'.format(str(e))
        )
        return jsonify({"error": str(e)})


# 修改计划的路由
@plan_blue.route('/update_plan', methods=['GET', 'POST'])
def update_plan():
    try:
        if request.method == 'POST':
            data = json.loads(request.get_data())
            result = Plan.update_plan(
                data['planID'],
                data['inOrOutbound'],
                data['planGoodsID'],
                datetime.strptime(data['planExpectedTime'], '%a, %d %b %Y %H:%M:%S %Z'),
                data['planExpectedAmount'],
                data['planStatus'],
                data['planUpdatedByID'],
                datetime.now(),
                None,
                None,
            )
            return jsonify(result)
        else:
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error(
            'Error occurred while updating plan. Error message: {}'.format(str(e))
        )
        return jsonify({"error": str(e)})


# 获取最大计划ID的路由（用于前端生成新计划ID）
@plan_blue.route('/get_max_planID')
def get_max_planID():
    try:
        result = Plan.get_max_planID()
        logging.info("获得最大的计划ID")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "Error occurred while getting max planID from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# 完成计划的路由
@plan_blue.route('/finish_plan', methods=['GET', 'POST'])
def finish_plan():
    try:
        if request.method == 'POST':
            data = json.loads(request.get_data())
            result = Plan.update_plan(
                data['planID'],
                data['inOrOutbound'],
                data['planGoodsID'],
                datetime.strptime(data['planExpectedTime'], '%a, %d %b %Y %H:%M:%S %Z'),
                data['planExpectedAmount'],
                data['planStatus'],
                data['planUpdatedByID'],
                datetime.strptime(data['planUpdatedTime'], '%a, %d %b %Y %H:%M:%S %Z'),
                data['planFinishedByID'],
                datetime.now(),
            )
            return jsonify(result)
        else:
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error(
            'Error occurred while finish plan. Error message: {}'.format(str(e))
        )
        return jsonify({"error": str(e)})


# 获取前端提交的id，删除id对应的计划
@plan_blue.route('/delete_plan/<string:plan_id>', methods=['GET', 'POST'])
def delete_plan(plan_id):
    try:
        if request.method == 'POST':
            result = Plan.delete_Plan(plan_id)
            return jsonify({'status': result})
        else:
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error(
            'Error occurred while deleting plan. Error message: {}'.format(str(e))
        )
        return jsonify({"error": str(e)})
