import React from "react";
import { Card, Button } from "antd";

export default class BaseInfoPage extends React.Component {
  render() {
    return (
      <div>
        <Card
          size="large"
          title="门店信息"
          extra={
            <Button type="dashed" icon="edit" onClick={() => {}}>编辑</Button>
          }
          style={{ width: 300 }}
          
        >
          <p>公司地址：</p>
          <p>联系人：</p>
          <p>电话：</p>
        </Card>

      </div>
    );
  }
}
