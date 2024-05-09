from flask import jsonify, request, json
from func.records import Inbound, Outbound
from func.goods import Goods
from record import record_blue
import logging
from datetime import datetime
import os
from flask import send_file
from openpyxl import load_workbook

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


# 获取所有入库记录的路由
@record_blue.route('/get_all_inbounds')
def get_all_inbounds():
    try:
        result = Inbound.get_all_inbounds()
        logging.info('获得所有入库操作记录信息')
        return jsonify(result)
    except Exception as e:
        logging.error(
            'Error occurred while getting all inbound records from the database. Error message: {}'.format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# 获取所有出库记录的路由
@record_blue.route('/get_all_outbounds')
def outbounds():
    try:
        result = Outbound.get_all_outbounds()
        logging.info('获得所有出库操作记录信息')
        return jsonify(result)
    except Exception as e:
        logging.error(
            'Error occurred while getting all outbound records from the database. Error message: {}'.format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# 获取最大出库单ID的路由（用于前端出库时生成新出库单）
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


# 获取最大出库记录ID的路由（用于前端出库时生成新出库记录ID）
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


# 访问api时生成出库单ID对应的出库单，浏览器自动下载生成的出库单
@record_blue.route('/generate_outbound_order_by_id/<string:outboundOrderID>')
def generate_outbound_order_by_id(outboundOrderID):
    try:
        filename = Outbound.generate_outbound_order_by_id(outboundOrderID)
        if filename:
            current_dir = os.getcwd()  # 获取当前工作目录路径

            parent_dir = os.path.dirname(current_dir)
            order_dir = os.path.join(parent_dir, 'order')
            # 如果 /order 目录不存在，则创建它
            if not os.path.exists(order_dir):
                os.makedirs(order_dir)
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


# 入库信息确认
@record_blue.route('/inboundConfirm', methods=['GET', 'POST'])
def inboundConfirm():
    try:
        if request.method == 'POST':
            goods_list = []
            userID = request.form.get('userID')
            file = request.files['file']

            current_dir = os.getcwd()  # 获取当前工作目录路径
            parent_dir = os.path.dirname(current_dir)
            order_dir = os.path.join(parent_dir, 'order')
            # 如果 /order 目录不存在，则创建它
            if not os.path.exists(order_dir):
                os.makedirs(order_dir)
            filepath = os.path.join(order_dir, file.filename)
            file.save(filepath)

            # 入库单数据提取
            wb = load_workbook(filepath)
            ws = wb.active
            # 设置标题行
            headers = [cell.value for cell in ws[1]]
            # 逐行读取文件中数据并添加到字典
            for row in ws.iter_rows(min_row=2, values_only=True):
                inbound_data = dict(zip(headers, row))
                goods_list.append(
                    {
                        'goodsID': '',
                        'goodsName': inbound_data['货物名称'],
                        'goodsSpecification': inbound_data['货物规格'],
                        'goodsManufacturer': inbound_data['生产厂商'],
                        'goodsProductionLicense': inbound_data['生产许可证'],
                        'goodsUnit': inbound_data['计量单位'],
                        'goodsAmount': inbound_data['入库数量'],
                        'goodsStorageCondition': inbound_data['存储条件'],
                        'goodsUpdatedByID': userID,
                        'goodsUpdatedTime': '',
                    }
                )
            return jsonify(goods_list)
    except Exception as e:
        logging.error(
            'Error occurred while inboundConfirm. Error message: {}'.format(str(e))
        )
        return jsonify({"error": str(e)})


# 货物入库
@record_blue.route('/inbound', methods=['GET', 'POST'])
def inbound():
    try:
        if request.method == 'POST':
            goods_list = request.json
            # 获取本次入库的入库单号
            inboundOrderID = int(Inbound.get_max_inboundOrderID()) + 1
            # 新货物的ID
            newGoodsID = int(Goods.get_max_goodsID()) + 1
            for data in goods_list:
                # 判断货物是否存在
                goodsExist = Goods.judgeExist(
                    data['goodsName'],
                    data['goodsSpecification'],
                    data['goodsManufacturer'],
                    data['goodsProductionLicense'],
                )
                # 货物存在，更新货物数量
                if goodsExist != '0':
                    amount = int(
                        Goods.get_goods_by_id(goodsExist)['goodsAmount']
                    ) + int(data['goodsAmount'])
                    Goods.update_goods(
                        goodsExist,
                        data['goodsName'],
                        data['goodsSpecification'],
                        data['goodsManufacturer'],
                        data['goodsProductionLicense'],
                        data['goodsUnit'],
                        amount,
                        data['goodsStorageCondition'],
                        data['goodsUpdatedByID'],
                        datetime.now(),
                    )
                    Inbound.add_inbound(
                        str(int(Inbound.get_max_inboundID()) + 1),
                        str(inboundOrderID),
                        goodsExist,
                        data['goodsAmount'],
                        data['goodsUpdatedByID'],
                        datetime.now(),
                    )
                else:
                    # 货物不存在，新增货物
                    Goods.add_goods(
                        newGoodsID,
                        data['goodsName'],
                        data['goodsSpecification'],
                        data['goodsManufacturer'],
                        data['goodsProductionLicense'],
                        data['goodsUnit'],
                        data['goodsAmount'],
                        data['goodsStorageCondition'],
                        data['goodsUpdatedByID'],
                        datetime.now(),
                    )
                    # 新增入库记录
                    Inbound.add_inbound(
                        str(int(Inbound.get_max_inboundID()) + 1),
                        str(inboundOrderID),
                        newGoodsID,
                        data['goodsAmount'],
                        data['goodsUpdatedByID'],
                        datetime.now(),
                    )
                    newGoodsID += 1
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error('Error occurred while inbound. Error message: {}'.format(str(e)))
        return jsonify({"error": str(e)})
