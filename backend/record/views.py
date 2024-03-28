from flask import jsonify, request, json
from func.records import Inbound, Outbound, Plan
from record import record_blue
import logging

# 错误日志
logging.basicConfig(filename="api.log", level=logging.DEBUG)


# 下面是与出入库记录模块api对应的不同路由
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


@record_blue.route('/get_outbound_record_by_user_id/<string:userID>')
def get_outbound_record_by_user_id(userID):
    try:
        result = Outbound.get_outbound_record_by_user_id(userID)
        logging.info('获得' + userID + '的出库操作记录信息')
        return jsonify(result)
    except Exception as e:
        logging.error(
            'Error occurred while getting inbound records by userID from the database. Error message: {}'.format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})
