from flask import jsonify, request, json
from models.users import User
from user import user_blue
import logging


# error log
logging.basicConfig(filename="users_api.log", level=logging.DEBUG)


# api which provide all users information
@user_blue.route('/get_all_users')
def get_all_users():
    try:
        result = User.get_all_users()
        logging.info("获得所有用户信息")
        return jsonify(result)  # return json format data
    except Exception as e:
        logging.error(
            "Error occurred while retrieving users from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# api which used to login user
@user_blue.route("/login", methods=["GET", "POST"])
def login():
    try:
        if request.method == "POST":
            data = json.loads(request.get_data())
            userID = data["userID"]
            userPasswordMD5 = data["userPasswordMD5"]
            judge = User.login(
                userID, userPasswordMD5
            )  # use model's method to verify user information
            return judge
        else:
            return jsonify({"status": "GET"})
    except Exception as e:
        logging.error("Error occurred while logging. Error message: {}".format(str(e)))
        return jsonify({"error": str(e)})


# api which provide the specified user information
@user_blue.route("/get_user_by_id/<string:userID>")
def get_user_by_id(userID):
    try:
        result = User.get_user_by_id(userID)
        logging.info("获得" + userID + "信息")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "Error occurred while retrieving id users from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# Obtain the ID and data submitted by the front-end, and modify the student information corresponding to the ID
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
                data['userCreatedByID'],
                data['userCreatedTime'],
            )
            return jsonify({'status': result})
        else:
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error(
            'Error occurred while updating user. Error message: {}'.format(str(e))
        )
        return jsonify({"error": str(e)})
