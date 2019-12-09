import React from "react";

import { Select, Table, Icon, Button, message, Input, Modal, Form } from "antd";
import ApiUtil from "../Utils/ApiUtil";
import HttpUtil from "../Utils/HttpUtil";
import UserInfoDialog from "./UserInfoDialog";

export default class UserManager extends React.Component {
  columns = [
    {
      title: "序号",
      width: 80,
      align: "center",
      render: (text, record, index) => <span>{index + 1}</span>
    },
    {
      title: "用户名",
      dataIndex: "name"
    },
    {
      title: "用户角色",
      dataIndex: "typeName",
      align: "center"
    },
    {
      title: "备注",
      dataIndex: "remarks"
    },
    {
      title: "编辑",
      align: "center",
      width: 160,
      render: item => (
        <span>
          <Icon
            type="edit"
            title="编辑"
            onClick={() => this.showDialog(item)}
          />
          <Icon
            type="close"
            title="删除"
            style={{ color: "#ee6633", marginLeft: 12 }}
            onClick={() => this.deleteConfirm(item)}
          />
        </span>
      )
    }
  ];

  userTypes = [
    {
      id: 0,
      name: "所有用户"
    },
    {
      id: 1,
      name: "系统管理员"
    },
    {
      id: 2,
      name: "出单员"
    },
    {
      id: 4,
      name: "工程师"
    }
  ];

  getTypeName(role) {
    for (let i = 0; i < this.userTypes.length; i++) {
      let item = this.userTypes[i];
      if (item.id == role) {
        return item.name;
      }
    }
  }

  state = {
    mItems: [],
    currentItem: {},
    showInfoDialog: false
  };

  getData(type) {
    HttpUtil.get(ApiUtil.API_GET_USERS + type)
      .then(data => {
        data.map(item => (item.typeName = this.getTypeName(item.role)));
        this.setState({
          mItems: data
        });
      })
      .catch(error => {
        message.error(error.message);
      });
  }

  componentDidMount() {
    this.getData(0);
  }

  render() {
    return (
      <div>
        <div>
          <Select
            style={{ width: 240, marginRight: 20, marginTop: 4 }}
            defaultValue={0}
            onChange={this.handleFilterChange}
          >
            {this.userTypes.map(item => (
              <Select.Option value={item.id} key={item.id + ""}>
                {item.name}
              </Select.Option>
            ))}
          </Select>

          <Button
            type="primary"
            icon="plus"
            onClick={() => this.showDialog()}
            style={{ float: "right", marginTop: 4 }}
          >
            添加
          </Button>
        </div>

        <Table
          style={{ marginTop: 10 }}
          dataSource={this.state.mItems}
          rowKey={item => item.id + ''}
          columns={this.columns}
          pagination={false}
        />

        <UserInfoDialog
          visible={this.state.showInfoDialog}
          user={this.state.currentItem}
          afterClose={() => this.setState({ showInfoDialog: false })}
          onDialogConfirm={this.handleInfoDialogClose}
        />
      </div>
    );
  }

  
  handleInfoDialogClose = (user) => {
    if (user) {
        if (user.id) { // 修改
            let datas = [...this.state.mItems];
            for (let i = 0; i < datas.length; i++) {
                if (datas[i].id === user.id) {
                    datas[i] = user;
                    this.setState({
                        mItems: datas,
                        showInfoDialog: false,
                    });
                    break;
                }
            }
        } else {    // 新增
            this.getData();
        }
    } else {    // 删除
        this.getData();
    }
}


  handleFilterChange = type => {
    this.getData(type);
  };

  showDialog = item => {
    if (item === undefined) {
      item = {
        id: 0,
        name: ""
      };
    } 
    let currentItem = Object.assign({}, this.state.currentItem, item); // 对象赋值，同时注意不要给state直接赋值，先追加到空对象{}
    this.setState({
      showInfoDialog: true,
      currentItem: currentItem
    });
  };

  handleAdd = () => {};

  handleTextChanged = e => {
    //console.log(e.target.value);
  };

  deleteConfirm = item => {};
}

const styles = {
  formItemLayout: {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
  },
  formItem2Col: {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 }
  }
};
