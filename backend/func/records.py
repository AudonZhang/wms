from app import db
import csv
from func.goods import Goods
import os


# 实现与入库记录相关的类与函数
class Inbound(db.Model):
    __tablename__ = "inbound"
    inboundID = db.Column(db.Integer, primary_key=True)
    inboundOrderID = db.Column(db.Integer)
    inboundGoodsID = db.Column(db.Integer)
    inboundAmount = db.Column(db.Integer)
    inboundUpdatedByID = db.Column(db.Integer)
    inboundUpdatedTime = db.Column(db.DateTime)

    # 根据用户ID获取对应的入库记录
    @staticmethod
    def get_inbound_record_by_user_id(userID):
        records = Inbound.query.filter(Inbound.inboundUpdatedByID == userID)
        if records is not None:
            inbound_record_list = []
            for record in records:
                inbound_record_list.append(
                    {
                        'inboundID': record.inboundID,
                        'inboundOrderID': record.inboundOrderID,
                        'inboundGoodsID': record.inboundGoodsID,
                        'inboundAmount': record.inboundAmount,
                        'inboundUpdatedByID': record.inboundUpdatedByID,
                        'inboundUpdatedTime': record.inboundUpdatedTime,
                    }
                )
            return inbound_record_list
        else:
            return '0'

    # 获取所有入库记录
    @staticmethod
    def get_all_inbounds():
        inbounds = Inbound.query.all()
        inbound_list = []
        if inbounds is not None:
            for inbound in inbounds:
                inbound_list.append(
                    {
                        'inboundID': inbound.inboundID,
                        'inboundOrderID': inbound.inboundOrderID,
                        'inboundGoodsID': inbound.inboundGoodsID,
                        'inboundAmount': inbound.inboundAmount,
                        'inboundUpdatedByID': inbound.inboundUpdatedByID,
                        'inboundUpdatedTime': inbound.inboundUpdatedTime,
                    }
                )
            return inbound_list
        else:
            return '0'

    # 新增入库记录
    @staticmethod
    def add_inbound(
        inboundID,
        inboundOrderID,
        inboundGoodsID,
        inboundAmount,
        inboundUpdatedByID,
        inboundUpdatedTime,
    ):
        query_inbound = Inbound.query.filter(Inbound.inboundID == inboundID)
        if len(query_inbound.all()) > 0:
            return '0'
        else:
            inbound = Inbound(
                inboundID=inboundID,
                inboundOrderID=inboundOrderID,
                inboundGoodsID=inboundGoodsID,
                inboundAmount=inboundAmount,
                inboundUpdatedByID=inboundUpdatedByID,
                inboundUpdatedTime=inboundUpdatedTime,
            )
            db.session.add(inbound)
            db.session.commit()
            return '1'

    # 获取最大的入库记录ID（用于前端入库操作时生成新入库记录ID）
    @staticmethod
    def get_max_inboundID():
        inbounds = Inbound.query.all()
        if inbounds is not None:
            max_inbounds_id = max(inbound.inboundID for inbound in inbounds)
            return str(max_inbounds_id)
        else:
            return '2024000001'  # 若数据库中无入库记录，则生成第一个入库记录ID

    # 获取最大的入库单ID（用于入库操作时生产新入库单ID）
    @staticmethod
    def get_max_inboundOrderID():
        inbounds = Inbound.query.all()
        if inbounds is not None:
            max_inboundOrder_id = max(inbound.inboundOrderID for inbound in inbounds)
            return str(max_inboundOrder_id)
        else:
            return '20240001'  # 若数据库中入库单，则生成第一个入库单ID


# 实现与出库记录相关的类与函数
class Outbound(db.Model):
    __tablename__ = "outbound"
    outboundID = db.Column(db.Integer, primary_key=True)
    outboundOrderID = db.Column(db.Integer)
    outboundGoodsID = db.Column(db.Integer)
    outboundAmount = db.Column(db.Integer)
    outboundUpdatedByID = db.Column(db.Integer)
    outboundUpdatedTime = db.Column(db.DateTime)

    # 根据用户ID获取对应的出库记录
    @staticmethod
    def get_outbound_record_by_user_id(userID):
        records = Outbound.query.filter(Outbound.outboundUpdatedByID == userID)
        if records is not None:
            outbound_record_list = []
            for record in records:
                outbound_record_list.append(
                    {
                        'outboundID': record.outboundID,
                        'outboundOrderID': record.outboundOrderID,
                        'outboundGoodsID': record.outboundGoodsID,
                        'outboundAmount': record.outboundAmount,
                        'outboundUpdatedByID': record.outboundUpdatedByID,
                        'outboundUpdatedTime': record.outboundUpdatedTime,
                    }
                )
            return outbound_record_list
        else:
            return '0'

    # 获取所有出库记录
    @staticmethod
    def get_all_outbounds():
        outbounds = Outbound.query.all()
        outbound_list = []
        if outbounds is not None:
            for outbound in outbounds:
                outbound_list.append(
                    {
                        'outboundID': outbound.outboundID,
                        'outboundOrderID': outbound.outboundOrderID,
                        'outboundGoodsID': outbound.outboundGoodsID,
                        'outboundAmount': outbound.outboundAmount,
                        'outboundUpdatedByID': outbound.outboundUpdatedByID,
                        'outboundUpdatedTime': outbound.outboundUpdatedTime,
                    }
                )
            return outbound_list
        else:
            return '0'

    # 获取最大的出库单ID（用于前端进行出库操作时生成新出库单ID）
    @staticmethod
    def get_max_outboundOrderID():
        outbounds = Outbound.query.all()
        if outbounds is not None:
            max_outboundOrder_id = max(
                outbound.outboundOrderID for outbound in outbounds
            )
            return str(max_outboundOrder_id)
        else:
            return '20240001'  # 若数据库中无出库单，则生成第一个出库单ID

    # 获取最大的出库记录ID（用于前端进行出库操作时生成新出库记录ID）
    @staticmethod
    def get_max_outboundID():
        outbounds = Outbound.query.all()
        if outbounds is not None:
            max_outbounds_id = max(outbound.outboundID for outbound in outbounds)
            return str(max_outbounds_id)
        else:
            return '2024000001'  # 若数据库中无出库记录，则生成第一个出库记录ID

    # 新增出库记录
    @staticmethod
    def add_outbound(
        outboundID,
        outboundOrderID,
        outboundGoodsID,
        outboundAmount,
        outboundUpdatedByID,
        outboundUpdatedTime,
    ):
        query_outbound = Outbound.query.filter(Outbound.outboundID == outboundID)
        if len(query_outbound.all()) > 0:
            return '0'
        else:
            outbound = Outbound(
                outboundID=outboundID,
                outboundOrderID=outboundOrderID,
                outboundGoodsID=outboundGoodsID,
                outboundAmount=outboundAmount,
                outboundUpdatedByID=outboundUpdatedByID,
                outboundUpdatedTime=outboundUpdatedTime,
            )
            db.session.add(outbound)
            db.session.commit()
            return '1'

    # 根据出库单ID生成出库单文件并返回出库单文件名（供前端下载）
    @staticmethod
    def generate_outbound_order_by_id(outboundOrderID):
        records = Outbound.query.filter(
            Outbound.outboundOrderID == outboundOrderID
        ).all()
        if records:
            first = records[0]
            filename = f"出库单号：{first.outboundOrderID}：出库人：{first.outboundUpdatedByID}：出库时间：{first.outboundUpdatedTime.strftime('%Y-%m-%d_%H-%M-%S')}.csv"

            # 设定文件保存目录
            current_dir = os.getcwd()  # 获取当前工作目录路径
            parent_dir = os.path.dirname(current_dir)  # 获取上级目录
            order_dir = os.path.join(parent_dir, 'order')  # 选择上级目录的order文件夹
            # 如果 /order 目录不存在，则创建它
            if not os.path.exists(order_dir):
                os.makedirs(order_dir)
            filepath = os.path.join(order_dir, filename)  # 选择生成的文件

            with open(filepath, 'w', newline='', encoding='utf_8_sig') as csvfile:
                fieldnames = [
                    '货物ID',
                    '货物名称',
                    '货物规格',
                    '生产厂家',
                    '生产许可证',
                    '出库数量',
                    '单位',
                    '存储条件',
                ]
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()

                for record in records:
                    # 根据货物ID查询货物信息
                    goods_info = Goods.get_goods_by_id(record.outboundGoodsID)
                    writer.writerow(
                        {
                            '货物ID': goods_info['goodsID'],
                            '货物名称': goods_info['goodsName'],
                            '货物规格': goods_info['goodsSpecification'],
                            '生产厂家': goods_info['goodsManufacturer'],
                            '生产许可证': goods_info['goodsProductionLicense'],
                            '出库数量': record.outboundAmount,
                            '单位': goods_info['goodsUnit'],
                            '存储条件': goods_info['goodsStorageCondition'],
                        }
                    )
            return filename  # 返回生成的文件名
        else:
            return '0'
