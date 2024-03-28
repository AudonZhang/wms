from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# 初始化并连接数据库
app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:200110@localhost:3306/wms"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


@app.route("/")
def hello_world():
    return "Hello World!"


# 注册不同模块对应的蓝图
from user import user_blue
from record import record_blue
from goods import goods_blue

app.register_blueprint(user_blue)
app.register_blueprint(record_blue)
app.register_blueprint(goods_blue)


if __name__ == "__main__":
    app.run()
