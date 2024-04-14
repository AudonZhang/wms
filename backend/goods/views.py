from datetime import datetime
from flask import jsonify, request, json
from func.goods import Goods
from goods import goods_blue
import logging

# 错误日志
logging.basicConfig(filename="api.log", level=logging.DEBUG)


# 根据货物ID获取货物信息的路由
@goods_blue.route("/get_goods_by_id/<string:goodsID>")
def get_goods_by_id(goodsID):
    try:
        result = Goods.get_goods_by_id(goodsID)
        logging.info("获得" + goodsID + "的信息")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "Error occurred while getting goods by goodsID from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# 获取所有货物信息的路由
@goods_blue.route('/get_all_goods')
def get_all_goods():
    try:
        result = Goods.get_all_goods()
        logging.info("获得所有货物信息")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "Error occurred while getting all goods from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# 新增货物的路由
@goods_blue.route('/add_goods', methods=['GET', 'POST'])
def add_goods():
    try:
        if request.method == 'POST':
            data = json.loads(request.get_data())
            # 判断货物是否存在
            judge = Goods.judgeExist(
                data['goodsName'],
                data['goodsSpecification'],
                data['goodsManufacturer'],
                data['goodsProductionLicense'],
            )
            # 货物不存在则新建货物
            if judge == '0':
                result = Goods.add_goods(
                    data['goodsID'],
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
                return jsonify(result)
            else:
                return jsonify('0')
        else:
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error(
            'Error occurred while adding goods. Error message: {}'.format(str(e))
        )
        return jsonify({"error": str(e)})


# 修改货物信息的路由
@goods_blue.route('/update_goods', methods=['GET', 'POST'])
def update_goods():
    try:
        if request.method == 'POST':
            data = json.loads(request.get_data())
            # 判断修改后的货物是否存在
            judge = Goods.judgeExist(
                data['goodsName'],
                data['goodsSpecification'],
                data['goodsManufacturer'],
                data['goodsProductionLicense'],
            )
            # 不存在则新建货物
            if judge == '0':
                result = Goods.update_goods(
                    data['goodsID'],
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
                return jsonify(result)
            else:
                return jsonify('0')
        else:
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error(
            'Error occurred while updating goods. Error message: {}'.format(str(e))
        )
        return jsonify({"error": str(e)})


# 获取最大的货物ID的路由（用于前端新建货物时生成新货物ID）
@goods_blue.route('/get_max_goodsID')
def get_max_goodsID():
    try:
        result = Goods.get_max_goodsID()
        logging.info("获得最大的货物ID")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "Error occurred while getting max goodsID from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})
