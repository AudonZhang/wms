from flask import jsonify, request, json
from func.records import Inbound, Outbound, Plan
from record import record_blue
import logging
from datetime import datetime
import os
from flask import send_file

# 错误日志
logging.basicConfig(filename="api.log", level=logging.DEBUG)


# 获取用户ID对应的入库记录的路由
@record_blue.route('/get_inbound_record_by_user_id/<string:userID>')
def get_inbound_record_by_user_id(userID):
    try:
        result = Inbound.get_inbound_record_by_user_id(userID)
        logging.info('获得' + userID + '的入库操作记录信息')
        return jsonify(result)
    except Exception as e:
        logging.error(
            'Error occurred while getting inbound records by userID from the database. Error message: {}'.format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# 获取用户ID对应的出库记录的路由
@record_blue.route('/get_outbound_record_by_user_id/<string:userID>')
def get_outbound_record_by_user_id(userID):
    try:
        result = Outbound.get_outbound_record_by_user_id(userID)
        logging.info('获得' + userID + '的出库操作记录信息')
        return jsonify(result)
    except Exception as e:
        logging.error(
            'Error occurred while getting outbound records by userID from the database. Error message: {}'.format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# 获取最大出库单ID的路由（用于前端出库时自动生成出库单ID）
@record_blue.route('/get_max_outboundOrderID')
def get_max_outboundOrderID():
    try:
        result = Outbound.get_max_outboundOrderID()
        logging.info("获得最大的出库单号")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "Error occurred while getting max outboundOrderID from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# 获取最大出库记录ID的路由（用于前端出库时自动生成出库记录ID）
@record_blue.route('/get_max_outboundID')
def get_max_outboundID():
    try:
        result = Outbound.get_max_outboundID()
        logging.info("获得最大的出库记录ID")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "Error occurred while getting max outboundID from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# 新增出库记录的路由
@record_blue.route('/add_outbound', methods=['GET', 'POST'])
def add_outbound():
    try:
        if request.method == 'POST':
            data = json.loads(request.get_data())
            result = Outbound.add_outbound(
                data['outboundID'],
                data['outboundOrderID'],
                data['outboundGoodsID'],
                data['outboundAmount'],
                data['outboundUpdatedByID'],
                datetime.now(),
            )
            return jsonify(result)
        else:
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error(
            'Error occurred while adding outbound. Error message: {}'.format(str(e))
        )
        return jsonify({"error": str(e)})


# 访问api时生成出库ID对应的出库单，浏览器会自动下载生成的出库单
@record_blue.route('/generate_outbound_order_by_id/<string:outboundOrderID>')
def generate_outbound_order_by_id(outboundOrderID):
    try:
        filename = Outbound.generate_outbound_order_by_id(outboundOrderID)
        if filename:
            current_dir = os.getcwd()  # 获取当前工作目录路径

            parent_dir = os.path.dirname(current_dir)
            order_dir = os.path.join(parent_dir, 'order')
            filepath = os.path.join(order_dir, filename)

            return send_file(filepath, as_attachment=True)
        else:
            return jsonify({"error": "No records found for the given outboundOrderID"})
    except Exception as e:
        logging.error(
            'Error occurred while generating outbound order by outboundOrderID from the database. Error message: {}'.format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})
