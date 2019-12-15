import React from "react";
import { Card, Button } from "antd";
import ApiUtil from "../Utils/ApiUtil";
import HttpUtil from "../Utils/HttpUtil";
import StoreDialog from "./StoreDialog";

export default class StorePage extends React.Component {
  state = {
    store: {id:1},
    showInfoDialog: false,
  }

  getData() {
    HttpUtil.get(ApiUtil.API_GET_STORE + this.state.store.id)
      .then(data => {
        this.setState({store: data});
      })
      .catch(error => {
        message.error(error.message);
      });
  }

  componentDidMount() {
    this.getData();
  }

  
  render() {
    let {store} = this.state;
    return (
      <div style={{ paddingTop: 36 }}>
        <Card
          size="large"
          title="门店信息"
          extra={
            <Button type="dashed" icon="edit" onClick={() => { this.setState({ showInfoDialog: true }) }}>编辑</Button>
          }
          style={{ margin: '0 auto', width: 600 }}
        >
          <p><span style={styles.textSpan}>公司名：</span>{store.name}</p>
          <p><span style={styles.textSpan}>地址：</span>{store.address}</p>
          <p><span style={styles.textSpan}>联系人：</span>{store.user}</p>
          <p><span style={styles.textSpan}>电话：</span>{store.phone}</p>
        </Card>

        {this.state.showInfoDialog &&
          <StoreDialog
            store={this.state.store}
            onClose={() => this.setState({ showInfoDialog: false })}
            onDialogConfirm={this.onDialogConfirm}
          />
        }

      </div>
    );
  }

  onDialogConfirm = (values) => {
    this.setState({
      showInfoDialog: false,
      store: values
    });

  }
}

const styles = {
  textSpan: {
    width: 80,
    display: 'inline-block'
  }
}
