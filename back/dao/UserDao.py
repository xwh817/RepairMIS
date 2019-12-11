import json

def addOrUpdateUser(conn, cursor, json_str):
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


def deleteUser(conn, cursor, id):
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


def getUsers(cursor, type):
    
    sql = "select * from t_user"
    if type > 0:
        sql += (' where role=%d' % type)
    print(sql)

    cursor.execute(sql)

    listAll = cursor.fetchall()     # fetchall() 获取所有记录
    parts = []
    for item in listAll:
        part = {
            'id': item[0],
            'name': item[1],
            'pwd': item[2],
            'role': item[3], 
            'phone': item[4],
        }
        parts.append(part)

    json_str = json.dumps(parts)
    #print(json_str)

    return json_str

