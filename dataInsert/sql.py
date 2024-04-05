from datetime import datetime
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import pymysql
import hashlib


# 初始化和连接数据库
pymysql.install_as_MySQLdb()
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:200110@localhost:3306/wms"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
app.config["SQLALCHEMY_ECHO"] = True
app.config["SQLALCHEMY_COMMIT_ON_TEARDOWN"] = False
db = SQLAlchemy(app)


# 定义Python中的类并通过'db.Model'与MySql中的table建立映射关系
# 用户表
class User(db.Model):
    __tablename__ = "user"
    userID = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(64))
    userGender = db.Column(db.String(64))
    userPasswordMD5 = db.Column(db.String(64))
    userPhone = db.Column(db.String(64))
    userEmail = db.Column(db.String(64))
    userRole = db.Column(db.String(64))
    userStatus = db.Column(db.String(64))
    userCreatedByID = db.Column(db.Integer)
    userCreatedTime = db.Column(db.DateTime)


# 货物表
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
    goodsCreatedByID = db.Column(db.Integer, db.ForeignKey("user.userID"))
    goodsCreatedTime = db.Column(db.DateTime)


# 入库记录表
class Inbound(db.Model):
    __tablename__ = "inbound"
    inboundID = db.Column(db.Integer, primary_key=True)
    inboundOrderID = db.Column(db.Integer)
    inboundGoodsID = db.Column(db.Integer, db.ForeignKey("goods.goodsID"))
    inboundAmount = db.Column(db.Integer)
    inboundCreatedByID = db.Column(db.Integer, db.ForeignKey("user.userID"))
    inboundCreatedTime = db.Column(db.DateTime)


# 出库记录表
class Outbound(db.Model):
    __tablename__ = "outbound"
    outboundID = db.Column(db.Integer, primary_key=True)
    outboundOrderID = db.Column(db.Integer)
    outboundGoodsID = db.Column(db.Integer, db.ForeignKey("goods.goodsID"))
    outboundAmount = db.Column(db.Integer)
    outboundCreatedByID = db.Column(db.Integer, db.ForeignKey("user.userID"))
    outboundCreatedTime = db.Column(db.DateTime)


# 出入库计划表
class Plan(db.Model):
    __tablename__ = "plan"
    planID = db.Column(db.Integer, primary_key=True)
    inOrOutbound = db.Column(db.String(64))
    planGoodsID = db.Column(db.Integer)
    planExpectedTime = db.Column(db.DateTime)
    planExpectedAmount = db.Column(db.Integer)
    planStatus = db.Column(db.String(64))
    planCreatedByID = db.Column(db.Integer)
    planCreatedTime = db.Column(db.DateTime)
    planFinishedByID = db.Column(db.Integer)
    planFinishedTime = db.Column(db.DateTime)


# 输入数据时将明文密码转化为MD5加密值并直接插入数据库
def md5_hash(text):
    md5_hash = hashlib.md5()
    md5_hash.update(text.encode("utf-8"))
    return md5_hash.hexdigest()


# 创建数据库中各表的记录并插入数据库
if __name__ == "__main__":
    with app.app_context():
        db.drop_all()
        db.create_all()

        user1 = User(
            userID="2024001",
            userName="张浩东",
            userGender="男",
            userPhone="15235167297",
            userPasswordMD5=md5_hash("2024001"),
            userEmail="765707885@qq.com",
            userStatus="在职",
            userRole="系统管理员",
        )
        user2 = User(
            userID="2024002",
            userName="申奇水",
            userGender="男",
            userPhone="18235166524",
            userPasswordMD5=md5_hash("2024002"),
            userEmail="287582739@qq.com",
            userStatus="在职",
            userRole="仓库管理员",
        )
        user3 = User(
            userID="2024003",
            userName="夏鸿洁",
            userGender="女",
            userPhone="17637998773",
            userPasswordMD5=md5_hash("2024003"),
            userEmail="795379541@qq.com",
            userStatus="在职",
            userRole="仓库管理员",
        )
        user4 = User(
            userID="2024004",
            userName="武博容",
            userGender="男",
            userPhone="15619058204",
            userPasswordMD5=md5_hash("2024004"),
            userEmail="103482994@qq.com",
            userStatus="在职",
            userRole="维护专员",
        )
        user5 = User(
            userID="2024005",
            userName="郑宏恺",
            userGender="男",
            userPhone="15235167211",
            userPasswordMD5=md5_hash("2024005"),
            userEmail="6839284895@qq.com",
            userStatus="离职",
            userRole="维护专员",
        )
        user6 = User(
            userID="2024006",
            userName="汲宏义",
            userGender="男",
            userPhone="15869060091",
            userPasswordMD5=md5_hash("2024006"),
            userEmail="130595930@qq.com",
            userStatus="离职",
            userRole="维护专员",
        )
        db.session.add_all([user1, user2, user3, user4, user5, user6])
        db.session.commit()

        goods1 = Goods(
            goodsID="202400001",
            goodsName="器械柜",
            goodsSpecification="C40",
            goodsManufacturer="山东育达健康科技有限公司",
            goodsProductionLicense="鲁食药监生产许20210064号",
            goodsUnit="个",
            goodsAmount=0,
            goodsStorageCondition="常温",
            goodsCreatedByID="2024001",
            goodsCreatedTime=datetime(2024, 1, 1, 12, 0, 0),
        )
        goods2 = Goods(
            goodsID="202400002",
            goodsName="麻醉机",
            goodsSpecification="AX-600",
            goodsManufacturer="深圳市科曼医疗设备有限公司",
            goodsProductionLicense="苏食药监械生产许20010041号",
            goodsUnit="台",
            goodsAmount=0,
            goodsStorageCondition="常温",
            goodsCreatedByID="2024001",
            goodsCreatedTime=datetime(2024, 1, 1, 12, 0, 0),
        )
        goods3 = Goods(
            goodsID="202400003",
            goodsName="洗牙机",
            goodsSpecification="MaxPiezo7",
            goodsManufacturer="桂林市锐锋医疗器械有限公司",
            goodsProductionLicense="桂食药监械生产许20180004号",
            goodsUnit="台",
            goodsAmount=3,
            goodsStorageCondition="常温",
            goodsCreatedByID="2024001",
            goodsCreatedTime=datetime(2024, 1, 1, 12, 0, 0),
        )
        goods4 = Goods(
            goodsID="202400004",
            goodsName="药品冷藏冰箱",
            goodsSpecification="MPC-5V1006A",
            goodsManufacturer="安徽中科都菱商用电器股份有限公司",
            goodsProductionLicense="皖食药监械生产许20160038号",
            goodsUnit="台",
            goodsAmount=0,
            goodsStorageCondition="常温",
            goodsCreatedByID="2024001",
            goodsCreatedTime=datetime(2024, 1, 1, 12, 0, 0),
        )
        goods5 = Goods(
            goodsID="202400005",
            goodsName="观片灯",
            goodsSpecification="ZN双联860*510*25MM",
            goodsManufacturer="任丘市大乾光电设备有限公司",
            goodsProductionLicense="冀沧食药监械生产备20190012号",
            goodsUnit="个",
            goodsAmount=0,
            goodsStorageCondition="常温",
            goodsCreatedByID="2024001",
            goodsCreatedTime=datetime(2024, 1, 1, 12, 0, 0),
        )
        db.session.add_all([goods1, goods2, goods3, goods4, goods5])
        db.session.commit()

        plan1 = Plan(
            planID="2024000001",
            inOrOutbound="Inbound",
            planGoodsID="202400001",
            planExpectedTime=datetime(2024, 2, 20, 12, 0, 0),
            planExpectedAmount="6",
            planStatus="已完成",
            planCreatedByID="2024001",
            planCreatedTime=datetime(2024, 1, 20, 16, 0, 0),
            planFinishedByID="2024001",
            planFinishedTime=datetime(2024, 2, 20, 12, 0, 0),
        )
        plan2 = Plan(
            planID="2024000002",
            inOrOutbound="Inbound",
            planGoodsID="202400002",
            planExpectedTime=datetime(2024, 2, 20, 12, 0, 0),
            planExpectedAmount="5",
            planStatus="已完成",
            planCreatedByID="2024001",
            planCreatedTime=datetime(2024, 1, 20, 16, 0, 0),
            planFinishedByID="2024001",
            planFinishedTime=datetime(2024, 2, 21, 12, 0, 0),
        )
        plan3 = Plan(
            planID="2024000003",
            inOrOutbound="Outbound",
            planGoodsID="202400001",
            planExpectedTime=datetime(2024, 3, 10, 12, 0, 0),
            planExpectedAmount="6",
            planStatus="已完成",
            planCreatedByID="2024001",
            planCreatedTime=datetime(2024, 1, 20, 16, 0, 0),
            planFinishedByID="2024002",
            planFinishedTime=datetime(2024, 3, 10, 12, 0, 0),
        )
        plan4 = Plan(
            planID="2024000004",
            inOrOutbound="Outbound",
            planGoodsID="202400002",
            planExpectedTime=datetime(2024, 3, 10, 12, 0, 0),
            planExpectedAmount="5",
            planStatus="已完成",
            planCreatedByID="2024001",
            planCreatedTime=datetime(2024, 1, 20, 16, 0, 0),
            planFinishedByID="2024002",
            planFinishedTime=datetime(2024, 3, 10, 12, 0, 0),
        )
        plan5 = Plan(
            planID="2024000005",
            inOrOutbound="Inbound",
            planGoodsID="202400003",
            planExpectedTime=datetime(2024, 3, 20, 12, 0, 0),
            planExpectedAmount="3",
            planStatus="已完成",
            planCreatedByID="2024004",
            planCreatedTime=datetime(2024, 3, 11, 16, 0, 0),
            planFinishedByID="2024001",
            planFinishedTime=datetime(2024, 3, 20, 12, 0, 0),
        )
        plan6 = Plan(
            planID="2024000006",
            inOrOutbound="Outbound",
            planGoodsID="202400003",
            planExpectedTime=datetime(2024, 4, 20, 12, 0, 0),
            planExpectedAmount="3",
            planStatus="未完成",
            planCreatedByID="2024002",
            planCreatedTime=datetime(2024, 3, 11, 16, 0, 0),
        )
        plan7 = Plan(
            planID="2024000007",
            inOrOutbound="Inbound",
            planGoodsID="202400005",
            planExpectedTime=datetime(2024, 4, 30, 12, 0, 0),
            planExpectedAmount="10",
            planStatus="未完成",
            planCreatedByID="2024001",
            planCreatedTime=datetime(2024, 3, 25, 16, 0, 0),
        )

        db.session.add_all([plan1, plan2, plan3, plan4, plan5, plan6, plan7])
        db.session.commit()

        inbound1 = Inbound(
            inboundID="202400001",
            inboundOrderID="20240001",
            inboundGoodsID="202400001",
            inboundAmount="6",
            inboundCreatedByID="2024001",
            inboundCreatedTime=datetime(2024, 2, 20, 12, 0, 0),
        )
        inbound2 = Inbound(
            inboundID="202400002",
            inboundOrderID="20240001",
            inboundGoodsID="202400002",
            inboundAmount="3",
            inboundCreatedByID="2024001",
            inboundCreatedTime=datetime(2024, 2, 20, 12, 0, 0),
        )
        inbound3 = Inbound(
            inboundID="202400003",
            inboundOrderID="20240002",
            inboundGoodsID="202400002",
            inboundAmount="2",
            inboundCreatedByID="2024001",
            inboundCreatedTime=datetime(2024, 2, 21, 12, 0, 0),
        )
        inbound4 = Inbound(
            inboundID="202400004",
            inboundOrderID="20240003",
            inboundGoodsID="202400003",
            inboundAmount="3",
            inboundCreatedByID="2024001",
            inboundCreatedTime=datetime(2024, 3, 20, 12, 0, 0),
        )
        outbound1 = Outbound(
            outboundID="202410001",
            outboundOrderID="20240001",
            outboundGoodsID="202400001",
            outboundAmount="6",
            outboundCreatedByID="2024002",
            outboundCreatedTime=datetime(2024, 3, 10, 12, 0, 0),
        )
        outbound2 = Outbound(
            outboundID="202410002",
            outboundOrderID="20240001",
            outboundGoodsID="202400002",
            outboundAmount="5",
            outboundCreatedByID="2024002",
            outboundCreatedTime=datetime(2024, 3, 10, 12, 0, 0),
        )
        db.session.add_all(
            [inbound1, inbound2, inbound3, inbound4, outbound1, outbound2]
        )
        db.session.commit()
