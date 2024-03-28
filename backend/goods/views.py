from flask import jsonify, request, json
from func.goods import Goods
from goods import goods_blue
import logging

# 错误日志
logging.basicConfig(filename="api.log", level=logging.DEBUG)


# 下面是与货物模块api对应的不同路由
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
