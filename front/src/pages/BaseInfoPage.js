import React from "react";
import { Card, Button } from "antd";

export default class BaseInfoPage extends React.Component {

  baseInfo = {
    name: '荆州市砼盟工程设备有限公司',
    address: '荆州市沙市区东方大道延伸路',
    user: '张三',
    phone: '123456'
  }
  render() {
    return (
      <div style={{paddingTop: 36}}>
        <Card
          size="large"
          title="门店信息"
          extra={
            <Button type="dashed" icon="edit" onClick={() => {}}>编辑</Button>
          }
          style={{ margin:'0 auto', width: 600 }}
        >
          <p><span style={styles.textSpan}>公司名：</span>{this.baseInfo.name}</p>
          <p><span style={styles.textSpan}>地址：</span>{this.baseInfo.address}</p>
          <p><span style={styles.textSpan}>联系人：</span>{this.baseInfo.user}</p>
          <p><span style={styles.textSpan}>电话：</span>{this.baseInfo.phone}</p>
        </Card>

      </div>
    );
  }
}

const styles = {
  textSpan: {
    width:80, 
    display:'inline-block'
  }
}
