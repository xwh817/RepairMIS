# -*- coding:utf-8 -*-

import sqlite3
import json
import csv
import datetime
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
            sid SMALLINT
            )'''
        sql_create_t_repair_items = '''CREATE TABLE IF NOT EXISTS t_repair_items(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            sid INTEGER,
            price NUMERIC,
            remarks VARCHAR(200)
            )'''
        sql_create_t_store = '''CREATE TABLE IF NOT EXISTS t_store(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            address VARCHAR(200),
            user VARCHAR(20) NOT NULL,
            phone VARCHAR(20) NOT NULL
            )'''
        sql_create_t_order = '''CREATE TABLE IF NOT EXISTS t_order(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sn VARCHAR(20),
            client_name VARCHAR(100) NOT NULL,
            client_model VARCHAR(100),
            client_user VARCHAR(100),
            client_phone VARCHAR(20),
            client_sn VARCHAR(100),
            staff VARCHAR(100),
            repair_items TEXT,
            parts TEXT,
            repair_item_ids TEXT,
            part_ids TEXT,
            totals INTEGER,
            create_time TIMESTAMP NOT NULL DEFAULT (datetime('now','localtime')),
            modify_time TIMESTAMP NOT NULL DEFAULT (datetime('now','localtime'))
            )'''
        sql_create_trigger_timestamp = '''CREATE TRIGGER IF NOT EXISTS trigger_auto_timestamp
            AFTER UPDATE ON t_order
            FOR EACH ROW
            BEGIN
                update t_order set modify_time=datetime('now','localtime') WHERE id = old.id;
            END;'''

        cursor.execute(sql_create_t_user)
        cursor.execute(sql_create_t_parts)
        cursor.execute(sql_create_t_repair_items)
        cursor.execute(sql_create_t_store)
        cursor.execute(sql_create_t_order)
        cursor.execute(sql_create_trigger_timestamp)
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
    sql = "select * from t_parts where sid=%d" % type
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
            'sid': item[5], 
        }
        parts.append(part)

    json_str = json.dumps(parts)
    #print(json_str)

    return json_str

def countPartItems(sid):
    sql = "select count(*) from t_parts where sid=%d" % sid
    print(sql)
    cursor.execute(sql)
    count = cursor.fetchone()[0]
    print('countPartItems:', count)
    return count


def addPartSuper(id, name):
    keys = 'id, name, sid'
    values = "%d, '%s', %d" %(id, name, 0)
    sql = "insert into t_parts(%s) VALUES(%s)" % (keys, values)
    print(sql)
    cursor.execute(sql)
    conn.commit()   # 提交更新，不然没有保存。

def addPart(name, unit, price, remarks, t):
    if price=='':
        price = '0'
    keys = 'name, unit, price, remarks, sid'
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
        sid = part.get('sid', 0)
        name = part.get('name', '')
        unit = part.get('unit', '')
        price = part.get('price', 0)
        remarks = part.get('remarks', '')
        result = ''
        newId = id

        if id == 0:  # 新增
            keys = 'name, unit, price, remarks, sid'
            values = "'%s','%s',%s,'%s',%s" %(name, unit, price, remarks, sid)
            sql = "insert into t_parts(%s) VALUES(%s)" % (keys, values)
            print(sql)
            cursor.execute(sql)
            result = '添加成功'
            newId = cursor.lastrowid
            print(result, "newId:", newId)
        else:   # 修改
            update = "name='%s', unit='%s', price=%d, remarks='%s', sid=%d" %(name, unit, price, remarks, sid)
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
        if countPartItems(id) > 0 :
            raise Exception('删除失败！该类别下已有子类，请先清空子类。')

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

def countRepairItems(sid):
    sql = "select count(*) from t_repair_items where sid=%d" % sid
    print(sql)
    cursor.execute(sql)
    count = cursor.fetchone()[0]
    print('countRepairItems:', count)
    return count



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
        if countRepairItems(id) > 0 :
            raise Exception('删除失败！该类别下已有子类，请先清空子类。')
        
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

def getStore(id, isJson=True):
    sql = "select * from t_store where id=%d" % id
    print(sql)
    cursor.execute(sql)
    item = cursor.fetchone()
    store = {
        'id': item[0],
        'name': item[1],
        'address': item[2], 
        'user': item[3], 
        'phone': item[4],
    }
    if isJson:
        json_str = json.dumps(store)
        return json_str
    else:
        return store

def updateStore(json_str):
    try:
        store = json.loads(json_str)
        id = store.get('id', 0)
        name = store.get('name', '')
        address = store.get('address', '')
        user = store.get('user', '')
        phone = store.get('phone', '')
        update = "name='%s', address='%s', user='%s', phone='%s'" %(name, address, user, phone)
        where = "where id=" + str(id)
        sql = "update t_store set %s %s" % (update, where)
        print(sql)
        cursor.execute(sql)
        conn.commit()
        result = '更新成功'
        re = {
                'code': 0,
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


def getNewOrderSN():
    day = datetime.date.today().strftime('%Y%m%d')
    items = searchOrder({'sn':day})
    maxIndex = 0
    for item in items:
        sn = item['sn']
        print(sn)
        index = int(sn.replace(day, ''))
        if (index > maxIndex):
            maxIndex = index
    newIndex = maxIndex + 1
    newSN = ''
    if (newIndex < 10):
        newSN = day + '0' + str(newIndex)
    else:
        newSN = day + str(newIndex)
    print("newSN: " + newSN)
    return newSN

def addOrUpdateOrder(json_str):
    try:
        print(json_str)
        order = json.loads(json_str)
        id = order.get('id', 0)
        client_name = order.get('client_name', '')
        client_model = order.get('client_model', '')
        client_user = order.get('client_user', '')
        client_phone = order.get('client_phone', '')
        client_sn = order.get('client_sn', '')
        staff = order.get('staff', '')
        repair_items = order.get('repair_items', '')
        parts = order.get('parts', '')
        repair_item_ids = order.get('repair_item_ids', '')  # 为了加快搜索，这里对id进行冗余
        part_ids = order.get('part_ids', '')
        totals = order.get('totals', '')
        result = ''
        newId = id
        sn = ''

        #print(repair_item_ids, part_ids)

        if id == 0:  # 新增
            sn = getNewOrderSN()
            keys = 'sn, client_name, client_model, client_user, client_phone, client_sn, staff, repair_items, parts, repair_item_ids, part_ids, totals'
            values = "'%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s'" % (sn, client_name, client_model, client_user, client_phone, client_sn, staff, repair_items, parts, repair_item_ids, part_ids, totals)
            sql = "INSERT INTO t_order (%s) values (%s)" % (keys, values)
            print(sql)
            cursor.execute(sql)
            result = '添加成功'
            newId = cursor.lastrowid
            print(result, "newId:", newId)
        else:   # 修改
            update = "client_name='%s', client_model='%s', client_user='%s', client_phone='%s', client_sn='%s', staff='%s', repair_items='%s', parts='%s', repair_item_ids='%s', part_ids='%s', totals='%s'" %(client_name, client_model, client_user, client_phone, client_sn, staff, repair_items, parts, repair_item_ids, part_ids, totals)
            where = "where id=" + str(id)
            sql = "update t_order set %s %s" % (update, where)
            print(sql)
            cursor.execute(sql)
            result = '更新成功'
            print(cursor.rowcount, result)

        conn.commit()
        re = {
            'code': 0,
            'newId': newId,
            'newSN': sn,
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

def orderAdapter(item):
    return {
            'id': item[0],
            'sn': item[1],
            'client_name': item[2],
            'client_model': item[3], 
            'client_user': item[4], 
            'client_phone': item[5], 
            'client_sn': item[6],  
            'staff': item[7],  
            'repair_items': item[8],  
            'parts': item[9],  
            'repair_item_ids': item[10],  
            'part_ids': item[11],  
            'totals': item[12],  
            'create_time': item[13], 
            'modify_time': item[14]
        }
 
def getOrders():
    sql = "select * from t_order"
    print(sql)

    cursor.execute(sql)

    listAll = cursor.fetchall()     # fetchall() 获取所有记录
    orders = []
    for item in listAll:
        order = orderAdapter(item)
        orders.append(order)

    json_str = json.dumps(orders)
    return json_str

def getOrderById(id):
    sql = "select * from t_order where id = %d" % id
    print(sql)
    cursor.execute(sql)
    item = cursor.fetchone()
    order = orderAdapter(item)
    #print(json.dumps(order))
    return order

def searchOrder(where):
    try:
        sql_where = ''
        where_items = []

        # 按型号
        sn = where.get('sn', '').strip()
        if len(sn) > 0:
            sql_like = ("sn like '" + sn + "%'")
            where_items.append(sql_like)

        # 按零件搜索
        part_id = where.get('part', 0)
        if part_id > 0:
            where['part'] = ''
            sql_like = ("part_ids like '%#" + str(part_id) + "#%'")
            where_items.append(sql_like)

        # 按零件搜索
        repair_item_id = where.get('repair_item', 0)
        if repair_item_id > 0:
            where['repair_item'] = ''
            sql_like = ("repair_item_ids like '%#" + str(repair_item_id) + "#%'")
            where_items.append(sql_like)

        # 按时间范围
        startDate = where.get('startDate', '')
        endDate = where.get('endDate', '')
        if len(startDate) > 0 and len(endDate) > 0:
            #sql_between = "create_time between %d and %d" % (startDate, endDate)
            sql_start = "datetime('%s 00:00:00')" % startDate
            sql_end = "datetime('%s 24:00:00')" % endDate
            sql_between = "create_time between %s and %s" % (sql_start, sql_end)
            where_items.append(sql_between)
        
        # 将之前已经处理过的条件清空，剩下的是相同的='%s'的条件项
        where['sn'] = ''
        where['startDate'] = ''
        where['endDate'] = ''
        for key, value in where.items():
            if len(value.strip()) > 0:
                where_item = (key + "='%s'" % value.strip())
                where_items.append(where_item)

        if len(where_items) > 0:
            sql_where = 'where ' + ' and '.join(where_items)
        
        #order = ' order by id desc'
        sql = "select * from t_order %s" % (sql_where)
        print(sql)

        cursor.execute(sql)
        dateList = cursor.fetchall()     # fetchall() 获取所有记录
        
        orders = []
        for item in dateList:
            order = orderAdapter(item)
            orders.append(order)
        return orders

    except Exception as e:
        print(repr(e))
        return []


def deleteOrder(id):
    try:
        sql = "delete from t_order where id=%d" % (id)
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

#countRepairItems(1042)


#dumpRepairItemsFromCVX()
#getRepairItems(0)

'''
sql = "drop table t_parts"
print(sql)
cursor.execute(sql)
conn.commit()

addPartSuper(1, "电器部分")
addPartSuper(2, "液压部分")
addPartSuper(3, "其他易损件部分")

dumpPartsFromCVX()
'''
#getParts()

""" 
sql = "insert into t_store values(1, '荆州市砼盟工程设备有限公司', '荆州市沙市区东方大道延伸路', '--', '123')"
cursor.execute(sql)
conn.commit() 
"""


""" 
sql = "drop table t_order"
print(sql)
cursor.execute(sql)
conn.commit()
 """


#getNewOrderSN()
