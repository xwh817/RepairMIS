# -*- coding:utf-8 -*-

import sqlite3
import json
import csv

db_name = 'repair_manager'

conn = sqlite3.connect(db_name + '.db', check_same_thread=False)
cursor = conn.cursor()


def createTables():
    try:
        sql_create_t_parts = '''CREATE TABLE IF NOT EXISTS t_parts(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            unit CHAR(2),
            price NUMERIC,
            remarks VARCHAR(200),
            sType SMALLINT
            )'''
        cursor.execute(sql_create_t_parts)
    except Exception as e:
        print(repr(e))


#createTables()


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
    

def dumpFromCVX():
    try:
        with open('parts.csv', encoding='gb2312') as f:
            csv_reader = csv.reader(f)
            for row in csv_reader:
                addPart(row[0],row[1],row[2],row[3],row[4])
    except Exception as e:
        print(repr(e))
        return json.dumps({'code': -1, 'message': repr(e)})


#dumpFromCVX()
#getParts()

# addOrUpdateJob('{"name": "test23", "index": 8}')
# addOrUpdateJob('{"name": "test23", "id": 8, "index": 8}')
# getJobList()

# staffTestData()
#staffList = getStaffsFromData(getStaffList(0))
# print(str(staffList))
#saveStaffToCVX(0)

#searchStaff({'job':4,'address':'123'})
#searchStaff({'job':0,'address':''})