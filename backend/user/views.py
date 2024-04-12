from flask import jsonify, request, json
from func.users import User
from user import user_blue
import logging
from datetime import datetime


# 错误日志
logging.basicConfig(filename="api.log", level=logging.DEBUG)


# 获取所有用户信息的路由
@user_blue.route('/get_all_users')
def get_all_users():
    try:
        result = User.get_all_users()
        logging.info("获得所有用户信息")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "Error occurred while getting users from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# 登录路由
@user_blue.route("/login", methods=["GET", "POST"])
def login():
    try:
        if request.method == "POST":
            data = json.loads(request.get_data())
            userID = data["userID"]
            userPasswordMD5 = data["userPasswordMD5"]
            judge = User.login(userID, userPasswordMD5)
            return judge
        else:
            return jsonify({"status": "GET"})
    except Exception as e:
        logging.error("Error occurred while logging. Error message: {}".format(str(e)))
        return jsonify({"error": str(e)})


# 获取指定ID的学生信息
@user_blue.route("/get_user_by_id/<string:userID>")
def get_user_by_id(userID):
    try:
        result = User.get_user_by_id(userID)
        logging.info("获得" + userID + "的信息")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "Error occurred while getting users by id from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# 根据ID解雇对应的员工
@user_blue.route('/unemploy_user/<string:userID>', methods=['GET', 'POST'])
def unemploy_user(userID):
    try:
        if request.method == 'POST':
            result = User.unemploy_user(userID)
            return jsonify({'status': result})
        else:
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error(
            'Error occurred while unemploying user. Error message: {}'.format(str(e))
        )
        return jsonify({"error": str(e)})


# 根据ID将解雇的员工恢复
@user_blue.route('/employ_user/<string:userID>', methods=['GET', 'POST'])
def employ_user(userID):
    try:
        if request.method == 'POST':
            result = User.employ_user(userID)
            return jsonify({'status': result})
        else:
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error(
            'Error occurred while employing user. Error message: {}'.format(str(e))
        )
        return jsonify({"error": str(e)})


# 新增用户
@user_blue.route('/add_user', methods=['GET', 'POST'])
def add_user():
    try:
        if request.method == 'POST':
            data = json.loads(request.get_data())
            result = User.add_user(
                data['userID'],
                data['userName'],
                data['userGender'],
                data['userPasswordMD5'],
                data['userPhone'],
                data['userEmail'],
                data['userRole'],
                data['userStatus'],
                data['userUpdatedByID'],
                datetime.now(),
            )
            return jsonify(result)
        else:
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error(
            'Error occurred while adding user. Error message: {}'.format(str(e))
        )
        return jsonify({"error": str(e)})


# 修改用户信息
@user_blue.route('/update_user', methods=['GET', 'POST'])
def update_user():
    try:
        if request.method == 'POST':
            data = json.loads(request.get_data())
            result = User.update_user(
                data['userID'],
                data['userName'],
                data['userGender'],
                data['userPasswordMD5'],
                data['userPhone'],
                data['userEmail'],
                data['userRole'],
                data['userStatus'],
                data['userUpdatedByID'],
                datetime.now(),
            )
            return jsonify({'status': result})
        else:
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error(
            'Error occurred while updating user. Error message: {}'.format(str(e))
        )
        return jsonify({"error": str(e)})


# 获取最大的用户ID（用于前端新建用户时生成ID）
@user_blue.route('/get_max_userID')
def get_max_userID():
    try:
        result = User.get_max_userID()
        logging.info("获得最大的用户ID")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "Error occurred while getting max userID from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})
