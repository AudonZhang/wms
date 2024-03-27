from app import db


# mapping between python class and mysql database table
class Inbound(db.Model):
    __tablename__ = "inbound"
    inboundID = db.Column(db.Integer, primary_key=True)
    inboundOrderID = db.Column(db.Integer)
    inboundGoodsID = db.Column(db.Integer)
    inboundAmount = db.Column(db.Integer)
    inboundCreatedByID = db.Column(db.Integer)
    inboundCreatedTime = db.Column(db.DateTime)

    @staticmethod
    def get_inbound_record_by_user_id(userID):  # 通过stu_id获得指定id的学生的预约信息
        records = Inbound.query.filter(Inbound.inboundCreatedByID == userID)
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


class Outbound(db.Model):
    __tablename__ = "outbound"
    outboundID = db.Column(db.Integer, primary_key=True)
    outboundOrderID = db.Column(db.Integer)
    outboundGoodsID = db.Column(db.Integer)
    outboundAmount = db.Column(db.Integer)
    outboundCreatedByID = db.Column(db.Integer)
    outboundCreatedTime = db.Column(db.DateTime)

    @staticmethod
    def get_outbound_record_by_user_id(userID):  # 通过stu_id获得指定id的学生的预约信息
        records = Outbound.query.filter(Outbound.outboundCreatedByID == userID)
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

    # # 下面是与预约记录相关的方法
    # @staticmethod
    # def get_all_reservations():   # 获取所有预约记录
    #     reservations = ReservationList.query.all()
    #     rsv_list = []
    #     for rsv in reservations:
    #         rsv_list.append({'studentID': rsv.studentID, 'apartmentID': rsv.apartmentID, 'rsvTime': rsv.rsvTime})
    #     return rsv_list
