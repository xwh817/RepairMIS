import json


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
            'pwd': item[2],
            'role': item[3], 
            'phone': item[4],
        }
        parts.append(part)

    json_str = json.dumps(parts)
    #print(json_str)

    return json_str

