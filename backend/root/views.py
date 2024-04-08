import os
from flask import jsonify, send_file
from func.users import User
from func.goods import Goods
from func.records import Inbound, Outbound, Plan
import pandas as pd
from root import root_blue
import logging


# 错误日志
logging.basicConfig(filename="api.log", level=logging.DEBUG)

# 备份时将英文列名映射为中文列名
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


# 生成数据库中信息备份并在浏览器中自动下载
@root_blue.route('/backup')
def backup():
    try:
        users = User.get_all_users()
        goodss = Goods.get_all_goods()
        inbounds = Inbound.get_all_inbounds()
        outbounds = Outbound.get_all_outbounds()
        plans = Plan.get_all_plans()

        users_df = pd.DataFrame(users)
        goods_df = pd.DataFrame(goodss)
        inbounds_df = pd.DataFrame(inbounds)
        outbounds_df = pd.DataFrame(outbounds)
        plans_df = pd.DataFrame(plans)

        # 将列名从英文替换为中文
        users_df.rename(columns=user_column_name_mapping, inplace=True)
        goods_df.rename(columns=goods_column_name_mapping, inplace=True)
        inbounds_df.rename(columns=inbound_column_name_mapping, inplace=True)
        outbounds_df.rename(columns=outbound_column_name_mapping, inplace=True)
        plans_df.rename(columns=plan_column_name_mapping, inplace=True)

        # 构造保存路径
        default_save_path = os.getcwd()  # 获取当前工作目录
        backup_dir = os.path.join(
            os.path.dirname(default_save_path), 'backup'
        )  # 构造"backup"文件夹的路径
        os.makedirs(backup_dir, exist_ok=True)  # 创建"backup"文件夹（如果不存在）
        save_path = os.path.join(backup_dir, 'backup.xlsx')  # 构造保存文件的完整路径

        # 写入Excel文件，并指定表单名为中文
        with pd.ExcelWriter(save_path) as writer:
            users_df.to_excel(writer, sheet_name='用户信息', index=False)
            goods_df.to_excel(writer, sheet_name='货物信息', index=False)
            inbounds_df.to_excel(writer, sheet_name='入库记录', index=False)
            outbounds_df.to_excel(writer, sheet_name='出库记录', index=False)
            plans_df.to_excel(writer, sheet_name='出入库计划', index=False)

        logging.info("数据库信息已保存到Excel文件！")

        return send_file(save_path, as_attachment=True)

    except Exception as e:
        logging.error("Error occurred while backup. Error message: {}".format(str(e)))
        return jsonify({"error": str(e)})
