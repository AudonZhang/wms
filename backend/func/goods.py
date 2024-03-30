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
    goodsCreatedByID = db.Column(db.Integer)
    goodsCreatedTime = db.Column(db.DateTime)

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
                'goodsCreatedByID': goods.goodsCreatedByID,
                'goodsCreatedTime': goods.goodsCreatedTime,
            }
            return goods_dict
        else:
            return '0'

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
                        'goodsCreatedByID': goods.goodsCreatedByID,
                        'goodsCreatedTime': goods.goodsCreatedTime,
                    }
                )
            return goods_list
        else:
            return '0'

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
        goodsCreatedByID,
        goodsCreatedTime,
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
            goods.goodsCreatedByID = goodsCreatedByID
            goods.goodsCreatedTime = goodsCreatedTime
            db.session.commit()
            return '1'
        else:
            return '0'

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
        goodsCreatedByID,
        goodsCreatedTime,
    ):
        goods = Goods.query.filter(Goods.goodsID == goodsID)
        if goods is not None:
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
                goodsCreatedByID=goodsCreatedByID,
                goodsCreatedTime=goodsCreatedTime,
            )
            db.session.add(goods)
            db.session.commit()
            return '1'
