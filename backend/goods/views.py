from flask import jsonify, request, json
from models.goods import Goods
from goods import goods_blue
import logging

# error log
logging.basicConfig(filename="goods_api.log", level=logging.DEBUG)


@goods_blue.route("/get_goods_by_id/<string:goodsID>")
def get_goods_by_id(goodsID):
    try:
        result = Goods.get_goods_by_id(goodsID)
        logging.info("获得" + goodsID + "信息")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "Error occurred while retrieving id goods from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})
