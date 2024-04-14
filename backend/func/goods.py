from app import db


# 实现与货物相关的类与函数
class Goods(db.Model):
    __tablename__ = "goods"
    goodsID = db.Column(db.Integer, primary_key=True)
    goodsName = db.Column(db.String(64))
    goodsSpecification = db.Column(db.String(64))
    goodsManufacturer = db.Column(db.String(64))
    goodsProductionLicense = db.Column(db.String(64))
    goodsUnit = db.Column(db.String(64))
    goodsAmount = db.Column(db.Integer)
    goodsStorageCondition = db.Column(db.String(64))
    goodsUpdatedByID = db.Column(db.Integer)
    goodsUpdatedTime = db.Column(db.DateTime)

    # 通过货物ID获取对应货物信息
    @staticmethod
    def get_goods_by_id(goodsID):
        goodss = Goods.query.filter(Goods.goodsID == goodsID)
        if goodss is not None:
            goods = goodss.first()
            goods_dict = {
                'goodsID': goods.goodsID,
                'goodsName': goods.goodsName,
                'goodsSpecification': goods.goodsSpecification,
                'goodsManufacturer': goods.goodsManufacturer,
                'goodsProductionLicense': goods.goodsProductionLicense,
                'goodsUnit': goods.goodsUnit,
                'goodsAmount': goods.goodsAmount,
                'goodsStorageCondition': goods.goodsStorageCondition,
                'goodsUpdatedByID': goods.goodsUpdatedByID,
                'goodsUpdatedTime': goods.goodsUpdatedTime,
            }
            return goods_dict
        else:
            return '0'

    # 获取所有货物信息
    @staticmethod
    def get_all_goods():
        goodss = Goods.query.all()
        goods_list = []
        if goodss is not None:
            for goods in goodss:
                goods_list.append(
                    {
                        'goodsID': goods.goodsID,
                        'goodsName': goods.goodsName,
                        'goodsSpecification': goods.goodsSpecification,
                        'goodsManufacturer': goods.goodsManufacturer,
                        'goodsProductionLicense': goods.goodsProductionLicense,
                        'goodsUnit': goods.goodsUnit,
                        'goodsAmount': goods.goodsAmount,
                        'goodsStorageCondition': goods.goodsStorageCondition,
                        'goodsUpdatedByID': goods.goodsUpdatedByID,
                        'goodsUpdatedTime': goods.goodsUpdatedTime,
                    }
                )
            return goods_list
        else:
            return '0'

    # 修改货物信息
    @staticmethod
    def update_goods(
        goodsID,
        goodsName,
        goodsSpecification,
        goodsManufacturer,
        goodsProductionLicense,
        goodsUnit,
        goodsAmount,
        goodsStorageCondition,
        goodsUpdatedByID,
        goodsUpdatedTime,
    ):
        goods = Goods.query.filter(Goods.goodsID == goodsID).first()
        if goods is not None:
            goods.goodsID = goodsID
            goods.goodsName = goodsName
            goods.goodsSpecification = goodsSpecification
            goods.goodsManufacturer = goodsManufacturer
            goods.goodsProductionLicense = goodsProductionLicense
            goods.goodsUnit = goodsUnit
            goods.goodsAmount = goodsAmount
            goods.goodsStorageCondition = goodsStorageCondition
            goods.goodsUpdatedByID = goodsUpdatedByID
            goods.goodsUpdatedTime = goodsUpdatedTime
            db.session.commit()
            return '1'
        else:
            return '0'

    # 新增货物
    @staticmethod
    def add_goods(
        goodsID,
        goodsName,
        goodsSpecification,
        goodsManufacturer,
        goodsProductionLicense,
        goodsUnit,
        goodsAmount,
        goodsStorageCondition,
        goodsUpdatedByID,
        goodsUpdatedTime,
    ):
        goods = Goods.query.filter(Goods.goodsID == goodsID)
        # 货物ID已存在
        if len(goods.all()) > 0:
            return '0'
        else:
            goods = Goods(
                goodsID=goodsID,
                goodsName=goodsName,
                goodsSpecification=goodsSpecification,
                goodsManufacturer=goodsManufacturer,
                goodsProductionLicense=goodsProductionLicense,
                goodsUnit=goodsUnit,
                goodsAmount=goodsAmount,
                goodsStorageCondition=goodsStorageCondition,
                goodsUpdatedByID=goodsUpdatedByID,
                goodsUpdatedTime=goodsUpdatedTime,
            )
            db.session.add(goods)
            db.session.commit()
            return '1'

    # 查询最大的货物ID（用于前端新增货物时生成新货物ID）
    @staticmethod
    def get_max_goodsID():
        goodss = Goods.query.all()
        if goodss is not None:
            max_goods_id = max(goods.goodsID for goods in goodss)
            return str(max_goods_id)
        else:
            return '202400001'  # 若数据库中无货物，则生成第一个货物ID

    # 根据货物信息判断货物是否存在
    @staticmethod
    def judgeExist(
        goodsName, goodsSpecification, goodsManufacturer, goodsProductionLicense
    ):
        existing_goods = Goods.query.filter(
            Goods.goodsName == goodsName,
            Goods.goodsSpecification == goodsSpecification,
            Goods.goodsProductionLicense == goodsProductionLicense,
            Goods.goodsManufacturer == goodsManufacturer,
        ).first()

        if existing_goods:
            return existing_goods.goodsID  # 货物存在则返回货物ID
        else:
            return '0'
