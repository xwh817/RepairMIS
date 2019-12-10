import React from "react";

import { Select, Table, Icon, Button, message, Spin, Modal } from "antd";
import ApiUtil from "../Utils/ApiUtil";
import HttpUtil from "../Utils/HttpUtil";
import UserInfoDialog from "./UserInfoDialog";
import CommonValues from "../Utils/CommonValues";

export default class UserManager extends React.Component {
  columns = [
    {
      title: "序号",
      dataIndex: "index",
      width: 80,
      align: "center",
    },
    {
      title: "用户名",
      dataIndex: "name"
    },
    {
      title: "用户角色",
      dataIndex: "role",
      align: "center",
      render: role => `${this.getTypeName(role)}`
    },
    {
      title: "电话",
      dataIndex: "phone",
      align: "center"
    },
    {
      title: "编辑",
      align: "center",
      width: 160,
      render: item => (
        <span>
          <Icon type="edit" title="编辑" onClick={() => this.showDialog(item)}/>
          <Icon type="close" title="删除" style={{ color: "#ee6633", marginLeft: 20 }} onClick={() => this.deleteConfirm(item)}/>
        </span>
      )
    }
  ];

  userTypes = [
    {
      id: 0,
      name: "所有用户"
    }, ...CommonValues.userTypes
  ];

  getTypeName(role) {
    for (let i = 0; i < this.userTypes.length; i++) {
      let item = this.userTypes[i];
      if (item.id === role) {
        return item.name;
      }
    }
  }

  state = {
    mItems: [],
    currentItem: {},
    loading: true,
    showInfoDialog: false
  };

  getData(type) {
    this.setState({
      loading: true,
    });
    HttpUtil.get(ApiUtil.API_GET_USERS + type)
      .then(data => {
        data.map((item,index) => item.index=index+1);
        this.setState({
          mItems: data,
          loading: false,
        });
      })
      .catch(error => {
        message.error(error.message);
      });
  }

  removeData(id) {
    HttpUtil.get(ApiUtil.API_USER_DELETE + id)
      .then(
        re => {
          message.info(re.message);
          this.getData(0);
        }
      ).catch(error => {
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


        <Spin spinning={this.state.loading} size="large" delay={500}>
          <Table
            style={{ marginTop: 10 }}
            dataSource={this.state.mItems}
            rowKey={item => item.id}
            columns={this.columns}
            pagination={false}
          />
        </Spin>

        <UserInfoDialog
          visible={this.state.showInfoDialog}
          user={this.state.currentItem}
          onClose={() => this.setState({ showInfoDialog: false })}
          onDialogConfirm={this.handleInfoDialogClose}
        />
      </div>
    );
  }


  handleInfoDialogClose = (user) => {
    this.setState({
      showInfoDialog: false
    });

    if (user.id) { // 修改
      let datas = [...this.state.mItems];
      for (let i = 0; i < datas.length; i++) {
        if (datas[i].id === user.id) {
          datas[i] = user;
          this.setState({
            mItems: datas
          });
          break;
        }
      }
    } else {    // 新增
      this.getData(0);
    }
  }


  handleFilterChange = type => {
    this.getData(type);
  };

  showDialog = item => {
    let currentItem = item;
    if (item === undefined) {
      currentItem = {
        id: 0,
        name: '',
        role: 0,
        pwd: '',
        phone: ''
      };
    }
    //let currentItem = Object.assign({}, this.state.currentItem, item); // 对象赋值，同时注意不要给state直接赋值，先追加到空对象{}
    this.setState({
      currentItem: currentItem,
      showInfoDialog: true
    });
  };

  deleteConfirm = item => {
    var that = this;    // 下面的内嵌对象里面，this就改变了，这里在外面存一下。
    Modal.confirm({
      title: '确认',
      content: '确定要删除该用户吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.removeData(item.id);
      },
      onCancel() { },
    });
  };
}