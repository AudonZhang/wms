import os
from flask import jsonify, request, json
from func.users import User
from func.goods import Goods
from func.records import Inbound, Outbound, Plan
import pandas as pd
from root import root_blue
import logging
from datetime import datetime


# 错误日志
logging.basicConfig(filename="api.log", level=logging.DEBUG)


# 下面是与用户模块api对应的不同路由
@root_blue.route('/backup')
def backup():
    try:
        users = User.get_all_users()
        goodss = Goods.get_all_goods()
        inbounds = Inbound.get_all_inbounds()
        outbounds = Outbound.get_all_outbounds()
        plans = Plan.get_all_plans()

        # 创建DataFrame
        users_df = pd.DataFrame(users)
        goods_df = pd.DataFrame(goodss)
        inbounds_df = pd.DataFrame(inbounds)
        outbounds_df = pd.DataFrame(outbounds)
        plans_df = pd.DataFrame(plans)

        # 构造保存路径
        default_save_path = os.getcwd()  # 获取当前工作目录
        backup_dir = os.path.join(
            os.path.dirname(default_save_path), 'backup'
        )  # 构造"backup"文件夹的路径
        os.makedirs(backup_dir, exist_ok=True)  # 创建"backup"文件夹（如果不存在）
        save_path = os.path.join(backup_dir, 'backup.xlsx')  # 构造保存文件的完整路径

        # 写入Excel文件
        with pd.ExcelWriter(save_path) as writer:
            users_df.to_excel(writer, sheet_name='Users', index=False)
            goods_df.to_excel(writer, sheet_name='Goods', index=False)
            inbounds_df.to_excel(writer, sheet_name='Inbounds', index=False)
            outbounds_df.to_excel(writer, sheet_name='Outbounds', index=False)
            plans_df.to_excel(writer, sheet_name='Plans', index=False)

        logging.info("数据库信息已保存到Excel文件！")

        logging.info("获得数据库中所有信息！")
        return jsonify('1')
    except Exception as e:
        logging.error("Error occurred while backup. Error message: {}".format(str(e)))
        return jsonify({"error": str(e)})
