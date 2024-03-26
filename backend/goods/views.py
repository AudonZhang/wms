from flask import jsonify, request, json
from models.goods import Goods
from record import record_blue
import logging

# error log
logging.basicConfig(filename="goods_api.log", level=logging.DEBUG)
