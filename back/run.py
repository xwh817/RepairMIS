#! /usr/bin/env python
# -*- coding: utf-8 -*-
# 使用flask提供restful接口
# 先安装依赖：pip install flask

from flask import Flask, render_template, request, send_from_directory
import os
import json
import SqliteUtil
import FileUtil
import ExcelUtil

# Flask初始化参数尽量使用你的包名，这个初始化方式是官方推荐的，官方解释：http://flask.pocoo.org/docs/0.12/api/#flask.Flask
'''
    template_folder 模板文件所在的目录
    static_folder 静态文件根目录（图片、css、js等）
    static_url_path url访问时根目录对应的path，可以自己改，映射到static_folder。和package.json里的homepage对应
'''
app = Flask(__name__, static_folder="templates",static_url_path="/repair-manager")
#app = Flask(__name__, template_folder='front-build', static_folder="front-build", static_url_path="/repair-manager")


# hello
@app.route('/hello')
def hello_world():
    return "Hello Flask!"

# 默认首页
@app.route('/')
def react():
    return render_template('index.html')


# api接口前缀
apiPrefix = '/api/v1/'


@app.route(apiPrefix + 'getUsers/<int:type>')
def getUsers(type):
    return SqliteUtil.getUsers(type)


@app.route(apiPrefix + 'updateUser', methods=['POST'])
def updateUser():
    data = request.get_data(as_text=True)
    re = SqliteUtil.addOrUpdateUser(data)
    return json.dumps(re)


@app.route(apiPrefix + 'deleteUser/<int:id>')
def deleteUser(id):
    re = SqliteUtil.deleteUser(id)
    return re


@app.route(apiPrefix + 'getParts/<int:type>')
def getParts(type):
    return SqliteUtil.getParts(type)

@app.route(apiPrefix + 'updatePart', methods=['POST'])
def updatePart():
    data = request.get_data(as_text=True)
    re = SqliteUtil.addOrUpdatePart(data)
    return json.dumps(re)

@app.route(apiPrefix + 'deletePart/<int:id>')
def deletePart(id):
    re = SqliteUtil.deletePart(id)
    return re


@app.route(apiPrefix + 'getRepairItems/<int:type>')
def getRepairItems(type):
    return SqliteUtil.getRepairItems(type)

@app.route(apiPrefix + 'updateRepairItem', methods=['POST'])
def updateRepairItem():
    data = request.get_data(as_text=True)
    re = SqliteUtil.addOrUpdateRepairItem(data)
    return json.dumps(re)

@app.route(apiPrefix + 'deleteRepairItem/<int:id>')
def deleteRepairItem(id):
    re = SqliteUtil.deleteRepairItem(id)
    return re


@app.route(apiPrefix + 'getStore/<int:id>')
def getStore(id):
    return SqliteUtil.getStore(id)

@app.route(apiPrefix + 'updateStore', methods=['POST'])
def updateStore():
    data = request.get_data(as_text=True)
    re = SqliteUtil.updateStore(data)
    return json.dumps(re)


@app.route(apiPrefix + 'getOrders')
def getOrders():
    return SqliteUtil.getOrders()

@app.route(apiPrefix + 'searchOrder')
def searchOrder():
    data = request.args.get('where')
    print("searchOrder:", data)
    where = json.loads(data)
    array = SqliteUtil.searchOrder(where)
    re = json.dumps(array)
    return re


@app.route(apiPrefix + 'updateOrder', methods=['POST'])
def updateOrder():
    data = request.get_data(as_text=True)
    re = SqliteUtil.addOrUpdateOrder(data)
    return json.dumps(re)


@app.route(apiPrefix + 'deleteOrder/<int:id>')
def deleteOrder(id):
    re = SqliteUtil.deleteOrder(id)
    return re

# rdm防止浏览器缓存，文件更新后还是下载的链接
@app.route(apiPrefix + 'fileGet/<int:id>/<rdm>')
def fileGet(id, rdm):
    print('fileGet: id:%d, rdm:%s' %(id, rdm))
    path = FileUtil.dirFiles()
    # 参数as_attachment=True，否则对于图片格式、txt格式，会把文件内容直接显示在浏览器，对于xlsx等格式，虽然会下载，但是下载的文件名也不正确
    fileName = ExcelUtil.buildExcel(id)
    return send_from_directory(path, fileName, as_attachment=True)


# if __name__ == '__main__': 确保服务器只会在该脚本被 Python 解释器直接执行的时候才会运行，而不是作为模块导入的时候。
if __name__ == "__main__":
    # 如果不限于本机使用：app.run(host='0.0.0.0')
    # 调试模式，修改文件之后自动更新重启。
    app.run(debug=True)
