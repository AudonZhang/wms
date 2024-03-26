from flask import jsonify, request, json
from models.records import Inbound, Outbound, Plan
from record import record_blue
import logging

# error log
logging.basicConfig(filename="records_api.log", level=logging.DEBUG)

# # 取消预约的路由‘http://127.0.0.1:5000/api/reservation/get_all_reservations’
# @reservation_blue.route('/get_all_reservations')
# def get_all_reservations():
#     try:
#         result = ReservationList.get_all_reservations()
#         logging.info('获得所有学生信息')
#         return jsonify(result)
#     except Exception as e:
#         logging.error('Error occurred while retrieving reservation from the database. Error message: {}'.format(str(e)))
#         return jsonify({"error": str(e)})


# # 预约公寓的路由‘http://127.0.0.1:5000/api/reservation/reserve_apartment’
# @reservation_blue.route('/reserve_apartment', methods=['GET', 'POST'])
# def reserve_apartment():
#     try:
#         if request.method == 'POST':
#             data = json.loads(request.get_data())
#             studentID = data['studentID']
#             apartmentID = data['apartmentID']
#             result = StudentList.reserve_apartment(studentID, apartmentID)
#             return result
#         else:
#             return jsonify({'status': 'GET'})
#     except Exception as e:
#         logging.error(
#             'Error occurred while retrieving id reservation from the database. Error message: {}'.format(str(e)))
#         return jsonify({"error": str(e)})


# # 取消预约的路由‘http://127.0.0.1:5000/api/reservation/cancel_reservation/<string:stu_id>’
# @reservation_blue.route('/cancel_reservation/<string:stu_id>', methods=['GET', 'POST'])
# def cancel_reservation(stu_id):
#     try:
#         if request.method == 'POST':
#             result = StudentList.cancel_reservation(stu_id)
#             return jsonify(result)
#         else:
#             return jsonify({'status': 'GET'})
#     except Exception as e:
#         logging.error('Error occurred while canceling reservation from the database. Error message: {}'.format(str(e)))
#         return jsonify({"error": str(e)})


# # 查找指定学生信息的路由‘http://127.0.0.1:5000/api/reservation/get_reservation_by_stu_id/<string:stu_id>’
# @record_blue.route('/get_record_by_user_id/<string:user_id>')
# def get_record_by_user_id(user_id):
#     try:
#         result = Inventory.get_record_by_user_id(user_id)
#         logging.info('获得' + user_id + '信息')
#         return jsonify(result)
#     except Exception as e:
#         logging.error(
#             'Error occurred while retrieving record by user_id from the database. Error message: {}'.format(
#                 str(e)
#             )
#         )
#         return jsonify({"error": str(e)})
