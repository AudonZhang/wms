import os
from flask import jsonify, send_file
from func.users import User
from func.goods import Goods
from func.records import Inbound, Outbound
from func.plans import Plan
import pandas as pd
from root import root_blue
import logging


# logs
logging.basicConfig(filename="api.log", level=logging.DEBUG)

# Convert English listing to Chinese listing during backup
user_column_name_mapping = {
    'userID': '用户ID',
    'userName': '用户姓名',
    'userGender': '用户性别',
    'userPasswordMD5': '用户密码MD5',
    'userPhone': '用户电话',
    'userEmail': '用户邮箱',
    'userRole': '用户角色',
    'userStatus': '用户状态',
    'userUpdatedByID': '更新者ID',
    'userUpdatedTime': '更新时间',
}

goods_column_name_mapping = {
    'goodsID': '货物ID',
    'goodsName': '货物名称',
    'goodsSpecification': '货物规格',
    'goodsManufacturer': '生产厂商',
    'goodsProductionLicense': '生产许可证',
    'goodsUnit': '计量单位',
    'goodsAmount': '货物数量',
    'goodsStorageCondition': '存储条件',
    'goodsUpdatedByID': '更新者ID',
    'goodsUpdatedTime': '更新时间',
}

inbound_column_name_mapping = {
    'inboundID': '入库记录ID',
    'inboundOrderID': '入库单ID',
    'inboundGoodsID': '入库货物ID',
    'inboundAmount': '入库数量',
    'inboundUpdatedByID': '更新者ID',
    'inboundUpdatedTime': '更新时间',
}

outbound_column_name_mapping = {
    'outboundID': '出库记录ID',
    'outboundOrderID': '出库单ID',
    'outboundGoodsID': '出库货物ID',
    'outboundAmount': '出库数量',
    'outboundUpdatedByID': '更新者ID',
    'outboundUpdatedTime': '更新时间',
}

plan_column_name_mapping = {
    'planID': '计划ID',
    'inOrOutbound': '出入库类型',
    'planGoodsID': '计划货物ID',
    'planExpectedTime': '预计时间',
    'planExpectedAmount': '预计数量',
    'planStatus': '计划状态',
    'planUpdatedByID': '更新者ID',
    'planUpdatedTime': '更新时间',
    'planFinishedByID': '完成者ID',
    'planFinishedTime': '完成时间',
}


# Route to generate a backup of information in the database and automatically download it in the browser
@root_blue.route('/backup')
def backup():
    try:
        # Get data
        users = User.get_all_users()
        goodss = Goods.get_all_goods()
        inbounds = Inbound.get_all_inbounds()
        outbounds = Outbound.get_all_outbounds()
        plans = Plan.get_all_plans()
        # Creata pandas data format
        users_df = pd.DataFrame(users)
        goods_df = pd.DataFrame(goodss)
        inbounds_df = pd.DataFrame(inbounds)
        outbounds_df = pd.DataFrame(outbounds)
        plans_df = pd.DataFrame(plans)

        # Convert listing names from English to Chinese
        users_df.rename(columns=user_column_name_mapping, inplace=True)
        goods_df.rename(columns=goods_column_name_mapping, inplace=True)
        inbounds_df.rename(columns=inbound_column_name_mapping, inplace=True)
        outbounds_df.rename(columns=outbound_column_name_mapping, inplace=True)
        plans_df.rename(columns=plan_column_name_mapping, inplace=True)

        # Construct the file saving path
        default_save_path = os.getcwd()  # Get the current working directory
        # Construct the path to the "backup" folder in the current directory
        backup_dir = os.path.join(os.path.dirname(default_save_path), 'backup')
        os.makedirs(
            backup_dir, exist_ok=True
        )  #  Create the "backup" folder (if it doesn't exist)
        save_path = os.path.join(
            backup_dir, 'backup.xlsx'
        )  # Construct the complete path to save the file

        # Write data from MySQL into an Excel file, specifying the Excel sheet name for each table
        with pd.ExcelWriter(save_path) as writer:
            users_df.to_excel(writer, sheet_name='用户信息', index=False)
            goods_df.to_excel(writer, sheet_name='货物信息', index=False)
            inbounds_df.to_excel(writer, sheet_name='入库记录', index=False)
            outbounds_df.to_excel(writer, sheet_name='出库记录', index=False)
            plans_df.to_excel(writer, sheet_name='出入库计划', index=False)

        logging.info("数据库信息已保存到Excel文件！")

        return send_file(save_path, as_attachment=True)

    except Exception as e:
        logging.error(
            "An error occurred while performing the backup. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})
