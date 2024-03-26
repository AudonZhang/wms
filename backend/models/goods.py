from app import db


class Goods(db.Model):
    __tablename__ = "goods"
    goodsID = db.Column(db.Integer, primary_key=True)
    goodsName = db.Column(db.String(64))
    goodsSpecification = db.Column(db.String(64))
    goodsManufacturer = db.Column(db.String(64))
    goodsProductionLicense = db.Column(db.String(64))
    goodsUnit = db.Column(db.String(64))
    goodsStorageCondition = db.Column(db.String(64))
    goodsCreatedByID = db.Column(db.Integer, db.ForeignKey("user.userID"))
    goodsCreatedTime = db.Column(db.DateTime)
