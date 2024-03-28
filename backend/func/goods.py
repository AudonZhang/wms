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
                'goodsStorageCondition': goods.goodsStorageCondition,
                'goodsCreatedByID': goods.goodsCreatedByID,
                'goodsCreatedTime': goods.goodsCreatedTime,
            }
            return goods_dict
        else:
            return '0'
