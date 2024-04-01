from app import db


# 实现与入库记录相关的类与函数
class Inbound(db.Model):
    __tablename__ = "inbound"
    inboundID = db.Column(db.Integer, primary_key=True)
    inboundOrderID = db.Column(db.Integer)
    inboundGoodsID = db.Column(db.Integer)
    inboundAmount = db.Column(db.Integer)
    inboundCreatedByID = db.Column(db.Integer)
    inboundCreatedTime = db.Column(db.DateTime)

    @staticmethod
    def get_inbound_record_by_user_id(userID):
        records = Inbound.query.filter(Inbound.inboundCreatedByID == userID)
        if records is not None:
            inbound_record_list = []
            for record in records:
                inbound_record_list.append(
                    {
                        'inboundID': record.inboundID,
                        'inboundOrderID': record.inboundOrderID,
                        'inboundGoodsID': record.inboundGoodsID,
                        'inboundAmount': record.inboundAmount,
                        'inboundCreatedByID': record.inboundCreatedByID,
                        'inboundCreatedTime': record.inboundCreatedTime,
                    }
                )
            return inbound_record_list
        else:
            return '0'

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
                        'inboundCreatedByID': inbound.inboundCreatedByID,
                        'inboundCreatedTime': inbound.inboundCreatedTime,
                    }
                )
            return inbound_list
        else:
            return '0'


# 实现与出库记录相关的类与函数
class Outbound(db.Model):
    __tablename__ = "outbound"
    outboundID = db.Column(db.Integer, primary_key=True)
    outboundOrderID = db.Column(db.Integer)
    outboundGoodsID = db.Column(db.Integer)
    outboundAmount = db.Column(db.Integer)
    outboundCreatedByID = db.Column(db.Integer)
    outboundCreatedTime = db.Column(db.DateTime)

    @staticmethod
    def get_outbound_record_by_user_id(userID):
        records = Outbound.query.filter(Outbound.outboundCreatedByID == userID)
        if records is not None:
            outbound_record_list = []
            for record in records:
                outbound_record_list.append(
                    {
                        'outboundID': record.outboundID,
                        'outboundOrderID': record.outboundOrderID,
                        'outboundGoodsID': record.outboundGoodsID,
                        'outboundAmount': record.outboundAmount,
                        'outboundCreatedByID': record.outboundCreatedByID,
                        'outboundCreatedTime': record.outboundCreatedTime,
                    }
                )
            return outbound_record_list
        else:
            return '0'

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
                        'outboundCreatedByID': outbound.outboundCreatedByID,
                        'outboundCreatedTime': outbound.outboundCreatedTime,
                    }
                )
            return outbound_list
        else:
            return '0'


# 实现与出入库计划相关的类与函数
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

    @staticmethod
    def get_all_plans():
        plans = Plan.query.all()
        plan_list = []
        if plans is not None:
            for plan in plans:
                plan_list.append(
                    {
                        'planID': plan.planID,
                        'inOrOutbound': plan.inOrOutbound,
                        'planGoodsID': plan.planGoodsID,
                        'planExpectedTime': plan.planExpectedTime,
                        'planExpectedAmount': plan.planExpectedAmount,
                        'planStatus': plan.planStatus,
                        'planCreatedByID': plan.planCreatedByID,
                        'planCreatedTime': plan.planCreatedTime,
                        'planFinishedByID': plan.planFinishedByID,
                        'planFinishedTime': plan.planFinishedTime,
                    }
                )
            return plan_list
        else:
            return '0'
