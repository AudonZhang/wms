from datetime import datetime
from flask import jsonify, request, json
from func.goods import Goods
from goods import goods_blue
import logging

# logs
logging.basicConfig(filename="api.log", level=logging.DEBUG)


# Route to fetch goods information based on goods ID
@goods_blue.route("/get_goods_by_id/<string:goodsID>")
def get_goods_by_id(goodsID):
    try:
        result = Goods.get_goods_by_id(goodsID)
        logging.info("获得" + goodsID + "的信息")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "An error occurred while retrieving goods information by goods ID from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# Route to fetch all goods information
@goods_blue.route('/get_all_goods')
def get_all_goods():
    try:
        result = Goods.get_all_goods()
        logging.info("获得所有货物信息")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "An error occurred while retrieving all goods information from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


#  Route to add new goods
@goods_blue.route('/add_goods', methods=['GET', 'POST'])
def add_goods():
    try:
        if request.method == 'POST':
            data = json.loads(request.get_data())
            # Determine if the goods exist
            judge = Goods.judgeExist(
                data['goodsName'],
                data['goodsSpecification'],
                data['goodsManufacturer'],
                data['goodsProductionLicense'],
            )
            # If the goods do not exist, create a new goods record
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
            'An error occurred while adding goods. Error message: {}'.format(str(e))
        )
        return jsonify({"error": str(e)})


# Route to modify goods information
@goods_blue.route('/update_goods', methods=['GET', 'POST'])
def update_goods():
    try:
        if request.method == 'POST':
            data = json.loads(request.get_data())
            # Determine if the goods exist
            judge = Goods.judgeExist(
                data['goodsName'],
                data['goodsSpecification'],
                data['goodsManufacturer'],
                data['goodsProductionLicense'],
            )
            # If the goods do not exist, modify goods information
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
            'An error occurred while modifying goods information. Error message: {}'.format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# Route for goods to be shipped out
@goods_blue.route('/out_goods', methods=['GET', 'POST'])
def out_goods():
    try:
        if request.method == 'POST':
            data = json.loads(request.get_data())
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
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error(
            'An error occurred while processing the goods shipment. Error message: {}'.format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# Route to fetch the maximum goods ID (used to generate a new goods ID when creating new goods)
@goods_blue.route('/get_max_goodsID')
def get_max_goodsID():
    try:
        result = Goods.get_max_goodsID()
        logging.info("获得最大的货物ID")
        return jsonify(result)
    except Exception as e:
        logging.error(
            " An error occurred while retrieving the maximum goods ID from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})
