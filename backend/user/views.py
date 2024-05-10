from flask import jsonify, request, json
from func.users import User
from user import user_blue
import logging
from datetime import datetime


# logs
logging.basicConfig(filename="api.log", level=logging.DEBUG)


# Route to fetch all user information
@user_blue.route('/get_all_users')
def get_all_users():
    try:
        result = User.get_all_users()
        logging.info("获得所有用户信息")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "An error occurred while retrieving all users from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# Route for logging in
@user_blue.route("/login", methods=["GET", "POST"])
def login():
    try:
        if request.method == "POST":
            data = json.loads(request.get_data())
            userID = data["userID"]
            userPasswordMD5 = data["userPasswordMD5"]
            judge = User.login(userID, userPasswordMD5)
            return jsonify(judge)
        else:
            return jsonify({"status": "GET"})
    except Exception as e:
        logging.error(
            "An error occurred while logging in. Error message: {}".format(str(e))
        )
        return jsonify({"error": str(e)})


# Route to fetch information of a user with a user ID
@user_blue.route("/get_user_by_id/<string:userID>")
def get_user_by_id(userID):
    try:
        result = User.get_user_by_id(userID)
        logging.info("获得" + userID + "的用户的信息")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "An error occurred while retrieving user information by ID from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# Route to dismiss an employee corresponding to the given ID
@user_blue.route('/unemploy_user/<string:userID>', methods=['GET', 'POST'])
def unemploy_user(userID):
    try:
        if request.method == 'POST':
            result = User.unemploy_user(userID)
            return jsonify(result)
        else:
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error(
            'An error occurred while dismissing the employee. Error message: {}'.format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# Route to reinstate the dismissed employee based on ID
@user_blue.route('/employ_user/<string:userID>', methods=['GET', 'POST'])
def employ_user(userID):
    try:
        if request.method == 'POST':
            result = User.employ_user(userID)
            return jsonify(result)
        else:
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error(
            'An error occurred while reinstating the employee. Error message: {}'.format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# Route to add a new user
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
            'An error occurred while adding a new user. Error message: {}'.format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


# Route to modify user information
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
            return jsonify(result)
        else:
            return jsonify({'status': 'GET'})
    except Exception as e:
        logging.error(
            'An error occurred while modifying user information. Error message: {}'.format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})


#  Route to fetch the maximum user ID (used to generate a new ID for a new user)
@user_blue.route('/get_max_userID')
def get_max_userID():
    try:
        result = User.get_max_userID()
        logging.info("获得最大的用户ID")
        return jsonify(result)
    except Exception as e:
        logging.error(
            "An error occurred while retrieving the maximum user ID from the database. Error message: {}".format(
                str(e)
            )
        )
        return jsonify({"error": str(e)})
