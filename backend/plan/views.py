from flask import jsonify, request, json
from plan import plan_blue
from func.plans import Plan
from func.goods import Goods
import logging
from datetime import datetime


# logs
logging.basicConfig(filename="api.log", level=logging.DEBUG)


# Route to fetch all planning records
@plan_blue.route('/get_all_plans')
def get_all_plans():
    try:
        result = Plan.get_all_plans()
        logging.info("获得所有计划信息")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "An error occurred while retrieving all planning records from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# Route to fetch all goods eligible for creating outbound plans
@plan_blue.route('/get_all_out_plan_goods')
def get_all_out_plan_goods():
    try:
        planResult = Plan.get_all_out_plans()
        goodsResult = Goods.get_all_goods()
        out_plan_goods_list = []
        for goods in goodsResult:
            # Goods with zero quantity cannot be scheduled for outbound plans
            if goods['goodsAmount'] == 0:
                continue
            # Calculate the inventory quantity of goods minus the quantity of goods in the unfinished outbound plans
            for plan in planResult:
                if (
                    plan['inOrOutbound'] == 'Outbound'
                    and plan['planGoodsID'] == goods['goodsID']
                    and plan['planStatus'] == '未完成'
                ):
                    goods['goodsAmount'] -= plan['planExpectedAmount']
            # Outbound plans cannot be scheduled if there are no remaining goods outside of the planned quantity
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
            "An error occurred while retrieving all goods for outbound planning from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# Route to add a new plan
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
            'An error occurred while adding the plan. Error message: {}'.format(str(e))
        )
        return jsonify({"error": str(e)})


# Route to modify plan information
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
            'An error occurred while updating the plan. Error message: {}'.format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# Route to fetch the maximum plan ID (used to generate a new plan ID)
@plan_blue.route('/get_max_planID')
def get_max_planID():
    try:
        result = Plan.get_max_planID()
        logging.info("获得最大的计划ID")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "An error occurred while retrieving the maximum plan ID from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# Route to complete a plan
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
            'An error occurred while completing the plan. Error message: {}'.format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# Route to delete the plan corresponding to the ID
@plan_blue.route('/delete_plan/<string:plan_id>', methods=['GET', 'POST'])
def delete_plan(plan_id):
    try:
        if request.method == 'POST':
            result = Plan.delete_Plan(plan_id)
            return jsonify(result)
        else:
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error(
            'An error occurred while deleting the plan. Error message: {}'.format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})
