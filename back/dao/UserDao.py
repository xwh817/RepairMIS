import json

def addOrUpdateUser(db, cursor, json_str):
  try:
    user = json.loads(json_str)
    id = user.get('id', 0)
    name = user.get('name', '')
    pwd = user.get('pwd', '')
    role = user.get('role', '2')
    phone = user.get('phone', '')
    result = ''

    if id == 0:  # 新增
      sql = "insert into t_user (name, pwd, role, phone) VALUES ('%s','%s', %s, '%s')" % (name, pwd, role, phone)
      #values = (name)
      print(sql)
      cursor.execute(sql)
      result = '添加成功'
      print(cursor.rowcount, result)
    else:   # 修改
      sql = "update t_user set name='%s' where id=%d" % (name, id)
      print(sql)
      cursor.execute(sql)
      result = '更新成功'
      print(cursor.rowcount, result)

    db.commit()
    re = {
      'code':0,
      'message':result
    }
    return json.dumps(re)
  except Exception as e:
    re = {
      'code':-1,
      'message':str(e)
    }
    print(str)
    return json.dumps(re)



def deleteUser(db, cursor, id):
  try:
    sql = "delete from t_user where id=%d" % (id)
    print(sql)
    cursor.execute(sql)
    db.commit()
    re = {
      'code':0,
      'message':'删除成功'
    }
    return json.dumps(re)
  except Exception as e:
    re = {
      'code':-1,
      'message':str(e)
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
            'role': item[3], 
            'phone': item[4],
        }
        parts.append(part)

    json_str = json.dumps(parts)
    #print(json_str)

    return json_str

