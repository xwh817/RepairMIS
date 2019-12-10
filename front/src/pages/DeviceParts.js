import React from "react";
import { Select, Table, Icon, Button, message, Input, Modal } from "antd";
import ApiUtil from "../Utils/ApiUtil";
import HttpUtil from "../Utils/HttpUtil";
import DevicePartDialog from "./DevicePartDialog";
import CommonValues from '../Utils/CommonValues';

export default class DeviceParts extends React.Component {
  columns = [
    {
      title: "序号",
      dataIndex: "index",
      width: 80,
      align: "center"
    },
    {
      title: "产品名称",
      dataIndex: "name"
    },
    {
      title: "单位",
      dataIndex: "unit",
      align: "center"
    },
    {
      title: "单价",
      dataIndex: "price",
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
      render: currentItem => (
        <span>
          <Icon type="edit" title="编辑" onClick={() => this.showUpdateDialog(currentItem)} />
          <Icon type="close" title="删除" style={{ color: "#ee6633", marginLeft: 20 }} onClick={() => this.deleteConfirm(currentItem)} />
        </span>
      )
    }
  ];

  state = {
    mItems: [],
    showInfoDialog: false,
    currentItem: {},
    mPartTypes: [{ id: 0, name: "配件大类" }, ...CommonValues.partTypes]
    //type: 0,
  };

  getData(type) {
    if (type === 0) {
      this.setState({
        mItems: CommonValues.partTypes
      });
    } else {
      HttpUtil.get(ApiUtil.API_GET_PARTS + type)
      .then(data => {
        data.map((item, index) => (item.index = index + 1));
        this.setState({
          mItems: data
        });
      })
      .catch(error => {
        message.error(error.message);
      });
    }
    
  }

  removeData(id) {
    HttpUtil.get(ApiUtil.API_PART_DELETE + id)
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
            {this.state.mPartTypes.map(item => (
              <Select.Option value={item.id} key={item.id + ""}>
                {item.name}
              </Select.Option>
            ))}
          </Select>

          <Button
            type="primary"
            icon="plus"
            onClick={() => this.showUpdateDialog()}
            style={{ float: "right", marginTop: 4 }}
          >
            添加
          </Button>
        </div>
        <Table
          style={{ marginTop: 10 }}
          dataSource={this.state.mItems}
          rowKey={item => item.id}
          columns={this.columns}
          onRow={this.onClickRow}
          pagination={false}
        />


        <DevicePartDialog
          visible={this.state.showInfoDialog}
          part={this.state.currentItem}
          partTypes={this.state.mPartTypes}
          onClose={() => this.setState({ showInfoDialog: false })}
          onDialogConfirm={this.handleInfoDialogClose}
        />

      </div>
    );
  }

  // 点击行
  /* onClickRow = item => {
    return {
      onClick: () => {
        message.info(item.name);
      }
    };
  }; */


  handleInfoDialogClose = (part) => {
    this.setState({
      showInfoDialog: false
    });

    if (part.id) { // 修改
      let datas = [...this.state.mItems];
      for (let i = 0; i < datas.length; i++) {
        if (datas[i].id === part.id) {
          part.index = datas[i].index;
          datas[i] = part;
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
    /* this.setState({
            type: type,
        }) */
    this.getData(type);
  };

  showUpdateDialog = item => {
    let currentItem = item;
    if (item === undefined) {
      currentItem = {
        id: 0,
        name: '',
        sType: 0
      };
    }
    this.setState({
      currentItem: currentItem,
      showInfoDialog: true
    });
  };

  handleAdd = () => { };

  handleTextChanged = e => {
    //console.log(e.target.value);
  };

  deleteConfirm = item => {
    var that = this;    // 下面的内嵌对象里面，this就改变了，这里在外面存一下。
    Modal.confirm({
      title: '确认',
      content: '确定要删除该配件吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.removeData(item.id);
      },
      onCancel() { },
    });
  };
}
