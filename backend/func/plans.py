from app import db


class Plan(db.Model):
    __tablename__ = "plan"
    planID = db.Column(db.Integer, primary_key=True)
    inOrOutbound = db.Column(db.String(64))
    planGoodsID = db.Column(db.Integer)
    planExpectedTime = db.Column(db.DateTime)
    planExpectedAmount = db.Column(db.Integer)
    planStatus = db.Column(db.String(64))
    planUpdatedByID = db.Column(db.Integer)
    planUpdatedTime = db.Column(db.DateTime)
    planFinishedByID = db.Column(db.Integer)
    planFinishedTime = db.Column(db.DateTime)

    # Fetch all plans
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
                        'planUpdatedByID': plan.planUpdatedByID,
                        'planUpdatedTime': plan.planUpdatedTime,
                        'planFinishedByID': plan.planFinishedByID,
                        'planFinishedTime': plan.planFinishedTime,
                    }
                )
            return plan_list
        else:
            return '0'

    # Fetch all outbound plans
    @staticmethod
    def get_all_out_plans():
        outPlans = Plan.query.filter(Plan.inOrOutbound == 'Outbound')
        plan_list = []
        if outPlans is not None:
            for plan in outPlans:
                plan_list.append(
                    {
                        'planID': plan.planID,
                        'inOrOutbound': plan.inOrOutbound,
                        'planGoodsID': plan.planGoodsID,
                        'planExpectedTime': plan.planExpectedTime,
                        'planExpectedAmount': plan.planExpectedAmount,
                        'planStatus': plan.planStatus,
                        'planUpdatedByID': plan.planUpdatedByID,
                        'planUpdatedTime': plan.planUpdatedTime,
                        'planFinishedByID': plan.planFinishedByID,
                        'planFinishedTime': plan.planFinishedTime,
                    }
                )
            return plan_list
        else:
            return '0'

    # Add a new plan
    @staticmethod
    def add_plan(
        planID,
        inOrOutbound,
        planGoodsID,
        planExpectedTime,
        planExpectedAmount,
        planStatus,
        planUpdatedByID,
        planUpdatedTime,
        planFinishedByID,
        planFinishedTime,
    ):
        query_plan = Plan.query.filter(Plan.planID == planID)
        if len(query_plan.all()) > 0:
            return '0'
        else:
            plan = Plan(
                planID=planID,
                inOrOutbound=inOrOutbound,
                planGoodsID=planGoodsID,
                planExpectedTime=planExpectedTime,
                planExpectedAmount=planExpectedAmount,
                planStatus=planStatus,
                planUpdatedByID=planUpdatedByID,
                planUpdatedTime=planUpdatedTime,
                planFinishedByID=planFinishedByID,
                planFinishedTime=planFinishedTime,
            )
            db.session.add(plan)
            db.session.commit()
            return '1'

    # Modify plan
    @staticmethod
    def update_plan(
        planID,
        inOrOutbound,
        planGoodsID,
        planExpectedTime,
        planExpectedAmount,
        planStatus,
        planUpdatedByID,
        planUpdatedTime,
        planFinishedByID,
        planFinishedTime,
    ):
        plan = Plan.query.filter(Plan.planID == planID).first()
        if plan is not None:
            plan.planID = planID
            plan.inOrOutbound = inOrOutbound
            plan.planGoodsID = planGoodsID
            plan.planExpectedTime = planExpectedTime
            plan.planExpectedAmount = planExpectedAmount
            plan.planStatus = planStatus
            plan.planUpdatedByID = planUpdatedByID
            plan.planUpdatedTime = planUpdatedTime
            plan.planFinishedByID = planFinishedByID
            plan.planFinishedTime = planFinishedTime
            db.session.commit()
            return '1'
        else:
            return '0'

    # Query the maximum plan ID (used to generate a new plan ID when adding a plan)
    @staticmethod
    def get_max_planID():
        plans = Plan.query.all()
        if plans is not None:
            max_plan_id = max(plan.planID for plan in plans)
            return str(max_plan_id)
        else:
            return '2024000001'  # If there are no plans in the database, generate the first plan ID

    # Delete plan record
    @staticmethod
    def delete_Plan(planID):
        plan = Plan.query.filter(Plan.planID == planID).first()
        if plan:
            db.session.delete(plan)
            db.session.commit()
            return '1'
        else:
            return '0'
