from app import db


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
    userUpdatedByID = db.Column(db.Integer)
    userUpdatedTime = db.Column(db.DateTime)

    # Fetch all user records
    @staticmethod
    def get_all_users():
        users = User.query.all()
        user_list = []
        if users is not None:
            for user in users:
                user_list.append(
                    {
                        'userID': user.userID,
                        'userName': user.userName,
                        'userGender': user.userGender,
                        'userPasswordMD5': user.userPasswordMD5,
                        'userPhone': user.userPhone,
                        'userEmail': user.userEmail,
                        'userRole': user.userRole,
                        'userStatus': user.userStatus,
                        'userUpdatedByID': user.userUpdatedByID,
                        'userUpdatedTime': user.userUpdatedTime,
                    }
                )
            return user_list
        else:
            return '0'

    # Get the corresponding user information based on the user ID
    @staticmethod
    def get_user_by_id(userID):
        users = User.query.filter(User.userID == userID)
        if users is not None:
            user = users.first()
            user_dict = {
                'userID': user.userID,
                'userName': user.userName,
                'userGender': user.userGender,
                'userPasswordMD5': user.userPasswordMD5,
                'userPhone': user.userPhone,
                'userEmail': user.userEmail,
                'userRole': user.userRole,
                'userStatus': user.userStatus,
                'userUpdatedByID': user.userUpdatedByID,
                'userUpdatedTime': user.userUpdatedTime,
            }
            return user_dict
        else:
            return '0'

    #  Log in using the user ID and passwordMD5
    @staticmethod
    def login(userID, userPasswordMD5):
        user = User.query.filter(
            User.userID == userID, User.userPasswordMD5 == userPasswordMD5
        ).first()
        if user is not None and user.userStatus == '在职':
            return '1'
        else:
            return '0'

    # Modify user information
    @staticmethod
    def update_user(
        userID,
        userName,
        userGender,
        userPasswordMD5,
        userPhone,
        userEmail,
        userRole,
        userStatus,
        userUpdatedByID,
        userUpdatedTime,
    ):
        user = User.query.filter(User.userID == userID).first()
        if user is not None:
            user.userID = userID
            user.userName = userName
            user.userPasswordMD5 = userPasswordMD5
            user.userGender = userGender
            user.userPhone = userPhone
            user.userEmail = userEmail
            user.userStatue = userStatus
            user.userRole = userRole
            user.userUpdatedByID = userUpdatedByID
            user.userUpdatedTime = userUpdatedTime
            db.session.commit()
            return '1'
        else:
            return '0'

    # Dismiss an employee
    @staticmethod
    def unemploy_user(userID):
        user = User.query.filter(User.userID == userID).first()
        if user is not None:
            user.userStatus = '离职'
            db.session.commit()
            return '1'
        else:
            return '0'

    # Rehire a previously dismissed employee
    @staticmethod
    def employ_user(userID):
        user = User.query.filter(User.userID == userID).first()
        if user is not None:
            user.userStatus = '在职'
            db.session.commit()
            return '1'
        else:
            return '0'

    # Add a new user
    @staticmethod
    def add_user(
        userID,
        userName,
        userGender,
        userPasswordMD5,
        userPhone,
        userEmail,
        userRole,
        userStatus,
        userUpdatedByID,
        userUpdatedTime,
    ):
        query_user = User.query.filter(User.userID == userID)
        if len(query_user.all()) > 0:
            return '0'
        else:
            user = User(
                userID=userID,
                userName=userName,
                userPasswordMD5=userPasswordMD5,
                userGender=userGender,
                userPhone=userPhone,
                userEmail=userEmail,
                userStatus=userStatus,
                userRole=userRole,
                userUpdatedByID=userUpdatedByID,
                userUpdatedTime=userUpdatedTime,
            )
            db.session.add(user)
            db.session.commit()
            return '1'

    # Fetch the maximum user ID (used to generate a new ID when creating a user)
    @staticmethod
    def get_max_userID():
        users = User.query.all()
        if users is not None:
            max_user_id = max(user.userID for user in users)
            return str(max_user_id)
        else:
            return '2024001'  #  If there are no users in the database, generate the first user ID
