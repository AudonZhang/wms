from app import db


# mapping between python class and mysql database table
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
    userCreatedByID = db.Column(db.String(64))
    userCreatedTime = db.Column(db.DateTime)

    @staticmethod
    def get_all_users():
        users = User.query.all()  # query all users' information in mysql table
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
                        'userCreatedByID': user.userCreatedByID,
                        'userCreatedTime': user.userCreatedTime,
                    }
                )
        return user_list

    @staticmethod
    def get_user_by_id(userID):
        users = User.query.filter(
            User.userID == userID
        )  # obtain the specified user information in mysql
        if len(users.all()) > 0:
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
                'userCreatedByID': user.userCreatedByID,
                'userCreatedTime': user.userCreatedTime,
            }
            return user_dict
        else:
            return '0'

    @staticmethod
    def login(userID, userPasswordMD5):
        user = User.query.filter(
            User.userID == userID, User.userPasswordMD5 == userPasswordMD5
        ).first()
        # user information is right and user still on the job
        if user is not None and user.userStatus == '在岗':
            return '1'  # log success
        else:
            return '0'  # log failure

    # update users' information in mysql
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
        userCreatedByID,
        userCreatedTime,
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
            user.userCreatedByID = userCreatedByID
            user.userCreatedTime = userCreatedTime
            db.session.commit()
            return 1
        else:
            return 0
