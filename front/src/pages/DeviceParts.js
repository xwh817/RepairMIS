import React from "react";
import { Select, Table, Icon, Button, message, Modal } from "antd";
import ApiUtil from "../Utils/ApiUtil";
import HttpUtil from "../Utils/HttpUtil";
import DevicePartDialog from "./DevicePartDialog";
import CommonValues from '../Utils/CommonValues';
import ArrayUtil from "../Utils/ArrayUtil";

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
  };

  currentType = 0;

  getData(type) {
    if (type === 0) {
      this.setState({
        mItems: CommonValues.partTypes
      });
    } else {
      HttpUtil.get(ApiUtil.API_GET_PARTS + type)
      .then(data => {
        data.map((item, index) => (item.index = index + 1));
        this.setState({mItems: data});
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
        <DevicePartDialog
          visible={this.state.showInfoDialog}
          part={this.state.currentItem}
          onClose={() => this.setState({ showInfoDialog: false })}
          onDialogConfirm={this.onDialogConfirm}
        />
      );
    }
  }

  renderColumns(){
    return this.currentType === 0 ? [...this.columns].splice(0, 2) : this.columns;
  }

  render() {
    return (
      <div>
        <div>
          <Select
            style={{ width: 240, marginRight: 20, marginTop: 4 }}
            defaultValue={this.currentType}
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
          columns={this.renderColumns()}
          onRow={this.currentType === 0 && this.onClickRow}
          pagination={false}
        />

        {this.renderDialog()}

      </div>
    );
  }

  // 点击行
  /* onClickRow = item => {
    return {
      onClick: () => {
        //message.info(item.name);
        this.currentType = item.id;
        this.getData(this.currentType);
      }
    };
  }; */


  onDialogConfirm = (part, newId) => {
    this.setState({
      showInfoDialog: false
    });

    if (part.id) { // 修改
      let datas = [...this.state.mItems];
      ArrayUtil.replaceItem(datas, part);
      this.setState({
        mItems: datas
      });
    } else {    // 新增
      part.id = newId;
      part.index = this.state.mItems.length+1;
      let datas = [...this.state.mItems];
      datas.push(part);
      this.setState({
        mItems: datas
      });
    }
  }

  handleFilterChange = type => {
    this.currentType = type;
    this.getData(type);
  };

  showUpdateDialog = item => {
    let currentItem = item;
    if (item === undefined) {
      currentItem = {
        id: 0,
        name: '',
        sType: this.currentType
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
