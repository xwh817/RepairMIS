import React from "react";

import { Select, Table, Icon, Button, message, Spin, Modal } from "antd";
import ApiUtil from "../Utils/ApiUtil";
import HttpUtil from "../Utils/HttpUtil";
import UserInfoDialog from "./UserInfoDialog";
import CommonValues from "../Utils/CommonValues";
import ArrayUtil from "../Utils/ArrayUtil";

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
  
  currentType = 0;

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
          let items = ArrayUtil.deleteItem(this.state.mItems, id);
          this.setState({mItems: items});
        }
      ).catch(error => {
        message.error(error.message);
      });
  }

  componentDidMount() {
    this.getData(this.currentType);
  }

  renderDialog(){
    if (this.state.showInfoDialog) {
      return (
        <UserInfoDialog
          visible={this.state.showInfoDialog}
          user={this.state.currentItem}
          onClose={() => this.setState({ showInfoDialog: false })}
          onDialogConfirm={this.onDialogConfirm}
        />
      );
    }
  }

  render() {
    return (
      <div style={{paddingTop:12}}>
        <div>
          <Select
            style={{ width: 240, marginRight: 20, marginTop: 4 }}
            defaultValue={this.currentType}
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

        {this.renderDialog()}
      </div>
    );
  }


  onDialogConfirm = (user, newId) => {
    this.setState({
      showInfoDialog: false
    });

    if (user.id) { // 修改
      let datas = [...this.state.mItems];
      ArrayUtil.replaceItem(datas, user);
      this.setState({
        mItems: datas
      });
    } else {    // 新增
      user.id = newId;
      user.index = this.state.mItems.length+1;
      let datas = [...this.state.mItems];
      datas.push(user);
      this.setState({
        mItems: datas
      });
    }
  }


  handleFilterChange = type => {
    this.currentType = type;
    this.getData(type);
  };

  showDialog = item => {
    let currentItem = item;
    if (item === undefined) {
      currentItem = {
        id: 0,
        name: '',
        role: this.currentType,
        pwd: '',
        phone: ''
      };
    }
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