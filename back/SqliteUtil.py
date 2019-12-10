# -*- coding:utf-8 -*-

import sqlite3
import json
import csv
import dao.UserDao as userDao

db_name = 'repair_manager'

conn = sqlite3.connect(db_name + '.db', check_same_thread=False)
cursor = conn.cursor()


def createTables():
    try:
        sql_create_t_user = '''CREATE TABLE IF NOT EXISTS t_user(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(30) NOT NULL,
            pwd VARCHAR(64),
            role INT UNSIGNED,
            phone VARCHAR(20)
            )'''
        sql_create_t_parts = '''CREATE TABLE IF NOT EXISTS t_parts(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            unit CHAR(2),
            price NUMERIC,
            remarks VARCHAR(200),
            sType SMALLINT
            )'''
        sql_create_t_repair_items = '''CREATE TABLE IF NOT EXISTS t_repair_items(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            sid INTEGER,
            price NUMERIC,
            remarks VARCHAR(200)
            )'''
        cursor.execute(sql_create_t_user)
        cursor.execute(sql_create_t_parts)
        cursor.execute(sql_create_t_repair_items)
    except Exception as e:
        print(repr(e))


#createTables()

def getUsers(type):
    return userDao.getUsers(cursor, type)

def addTestUsers(name, pwd, role, phone):
    sql = "insert into t_user (name, pwd, role, phone) VALUES ('%s','%s', %s, '%s')" % (name, pwd, role, phone)
    cursor.execute(sql)
    conn.commit()
def addOrUpdateUser(json_str):
    try:
        print(json_str)
        user = json.loads(json_str)
        id = user.get('id', 0)
        name = user.get('name', '')
        pwd = user.get('pwd', '')
        role = user.get('role', 0)
        phone = user.get('phone', '')
        result = ''
        newId = id

        if id == 0:  # 新增
            keys = 'name, pwd, role, phone'
            values = "'%s','%s',%d,'%s'" % (name, pwd, role, phone)
            sql = "INSERT INTO t_user (%s) values (%s)" % (keys, values)
            print(sql)
            cursor.execute(sql)
            result = '添加成功'
            newId = cursor.lastrowid
            print(result, "newId:", newId)
        else:   # 修改
            update = "name='%s', pwd='%s', role=%d, phone='%s'" %(name, pwd, role, phone)
            where = "where id=" + str(id)
            sql = "update t_user set %s %s" % (update, where)
            print(sql)
            cursor.execute(sql)
            result = '更新成功'
            print(cursor.rowcount, result)

        conn.commit()
        re = {
            'code': 0,
            'newId': newId,
            'message': result
        }
        return re
    except Exception as e:
        print(repr(e))
        re = {
            'code': -1,
            'message': repr(e)
        }
        return re


def deleteUser(id):
    try:
        sql = "delete from t_user where id=%d" % (id)
        print(sql)
        cursor.execute(sql)
        conn.commit()
        re = {
            'code': 0,
            'message': '删除成功'
        }
        return json.dumps(re)
    except Exception as e:
        re = {
            'code': -1,
            'message': repr(e)
        }
        return json.dumps(re)




def getParts(type):

    sql = "select * from t_parts"
    if type > 0:
        sql += (' where sType=%d' % type)

    print(sql)

    cursor.execute(sql)

    listAll = cursor.fetchall()     # fetchall() 获取所有记录
    parts = []
    for item in listAll:
        part = {
            'id': item[0],
            'name': item[1],
            'unit': item[2], 
            'price': item[3], 
            'remarks': item[4], 
            'sType': item[5], 
        }
        parts.append(part)

    json_str = json.dumps(parts)
    #print(json_str)

    return json_str


def addPart(name, unit, price, remarks, t):
    if price=='':
        price = '0'
    keys = 'name, unit, price, remarks, sType'
    values = "'%s','%s',%s,'%s',%s" %(name, unit, price, remarks, t)
    sql = "insert into t_parts(%s) VALUES(%s)" % (keys, values)
    #print(sql)
    cursor.execute(sql)
    conn.commit()   # 提交更新，不然没有保存。

def addOrUpdatePart(json_str):
    try:
        print(json_str)
        part = json.loads(json_str)
        id = part.get('id', 0)
        sType = part.get('sType', 0)
        name = part.get('name', '')
        unit = part.get('unit', '')
        price = part.get('price', 0)
        remarks = part.get('remarks', '')
        result = ''
        newId = id

        if id == 0:  # 新增
            keys = 'name, unit, price, remarks, sType'
            values = "'%s','%s',%s,'%s',%s" %(name, unit, price, remarks, sType)
            sql = "insert into t_parts(%s) VALUES(%s)" % (keys, values)
            print(sql)
            cursor.execute(sql)
            result = '添加成功'
            newId = cursor.lastrowid
            print(result, "newId:", newId)
        else:   # 修改
            update = "name='%s', unit='%s', price=%d, remarks='%s', sType=%d" %(name, unit, price, remarks, sType)
            where = "where id=" + str(id)
            sql = "update t_parts set %s %s" % (update, where)
            print(sql)
            cursor.execute(sql)
            result = '更新成功'
            print(cursor.rowcount, result)

        conn.commit()
        re = {
            'code': 0,
            'newId': newId,
            'message': result
        }
        return re
    except Exception as e:
        print(repr(e))
        re = {
            'code': -1,
            'message': repr(e)
        }
        return re


def deletePart(id):
    try:
        sql = "delete from t_parts where id=%d" % (id)
        print(sql)
        cursor.execute(sql)
        conn.commit()
        re = {
            'code': 0,
            'message': '删除成功'
        }
        return json.dumps(re)
    except Exception as e:
        re = {
            'code': -1,
            'message': repr(e)
        }
        return json.dumps(re)




# 获取维修项目，sid=0为大类
def getRepairItems(sid):
    sql = "select * from t_repair_items where sid=%d" % sid
    print(sql)

    cursor.execute(sql)

    listAll = cursor.fetchall()     # fetchall() 获取所有记录
    parts = []
    for item in listAll:
        part = {
            'id': item[0],
            'name': item[1],
            'sid': item[2], 
            'price': item[3], 
            'remarks': item[4],
        }
        parts.append(part)

    json_str = json.dumps(parts)
    #print(json_str)

    return json_str


def addOrUpdateRepairItem(json_str):
    try:
        print(json_str)
        repairItem = json.loads(json_str)
        id = repairItem.get('id', 0)
        sid = repairItem.get('sid', 0)
        name = repairItem.get('name', '')
        price = repairItem.get('price', 0)
        remarks = repairItem.get('remarks', '')
        result = ''
        newId = id

        if id == 0:  # 新增
            keys = 'name, sid, price, remarks'
            values = "'%s',%s,%s,'%s'" %(name, sid, price, remarks)
            sql = "insert into t_repair_items(%s) VALUES(%s)" % (keys, values)
            print(sql)
            cursor.execute(sql)
            result = '添加成功'
            newId = cursor.lastrowid
            print(result, "newId:", newId)
        else:   # 修改
            update = "name='%s', sid=%d, price=%d, remarks='%s'" %(name, sid, price, remarks)
            where = "where id=" + str(id)
            sql = "update t_repair_items set %s %s" % (update, where)
            print(sql)
            cursor.execute(sql)
            result = '更新成功'
            print(cursor.rowcount, result)

        conn.commit()
        re = {
            'code': 0,
            'newId': newId,
            'message': result
        }
        return re
    except Exception as e:
        print(repr(e))
        re = {
            'code': -1,
            'message': repr(e)
        }
        return re


def deleteRepairItem(id):
    try:
        sql = "delete from t_repair_items where id=%d" % (id)
        print(sql)
        cursor.execute(sql)
        conn.commit()
        re = {
            'code': 0,
            'message': '删除成功'
        }
        return json.dumps(re)
    except Exception as e:
        re = {
            'code': -1,
            'message': repr(e)
        }
        return json.dumps(re)

def addRepairItem(id, name, sid, price):
    if price=='':
        price = '0'
    keys = 'id, name, sid, price'
    values = "%s,'%s',%s,%s" %(id, name, sid, price)
    sql = "insert into t_repair_items(%s) VALUES(%s)" % (keys, values)
    #print(sql)
    cursor.execute(sql)
    conn.commit()   # 提交更新，不然没有保存。
       
       
def dumpPartsFromCVX():
    try:
        with open('parts.csv', encoding='gb2312') as f:
            csv_reader = csv.reader(f)
            for row in csv_reader:
                addPart(row[0],row[1],row[2],row[3],row[4])
    except Exception as e:
        print(repr(e))
        return json.dumps({'code': -1, 'message': repr(e)})

def dumpRepairItemsFromCVX():
    try:
        with open('repairItems.csv', encoding='gb2312') as f:
            csv_reader = csv.reader(f)
            sid = 0
            for row in csv_reader:
                price = '0'
                if len(row) > 2:
                    price = row[2]
                if price =='' or price == '0':#大类
                    sid = row[0]
                    print(row)
                    addRepairItem(row[0],row[1],'0','0')
                else:
                    print(row[0], sid)
                    addRepairItem(row[0],row[1],sid,price)
            conn.commit()   # 提交更新，不然没有保存。
    except Exception as e:
        print(repr(e))
        return json.dumps({'code': -1, 'message': repr(e)})

#createTables()
'''
addTestUsers('Admin', '123', 1, '13112345566')
addTestUsers('Operator', '123', 2, '13112345566')
addTestUsers('工程师1', '123', 4, '13112345566')
addTestUsers('工程师2', '123', 4, '13112345566')
addTestUsers('工程师3', '123', 4, '13112345566')
'''

#getUsers(0)


#dumpRepairItemsFromCVX()
#getRepairItems(0)

#dumpFromCVX()
#getParts()

# addOrUpdateJob('{"name": "test23", "index": 8}')
# addOrUpdateJob('{"name": "test23", "id": 8, "index": 8}')
# getJobList()
