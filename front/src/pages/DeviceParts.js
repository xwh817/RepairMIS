import React from "react";
import { Table, Icon, Button, message, Modal, Breadcrumb } from "antd";
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
      render: item => <span style={{ cursor: "pointer", color:item.sid===0?'#1890ff':'' }} onClick={() => this.onItemClick(item)}>{item.name}</span>
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
    mTypes: [{ id: 0, name: "配件大类" }, ...CommonValues.partTypes]
  };

  currentType = 0;

  getData(type) {
    HttpUtil.get(ApiUtil.API_GET_PARTS + type)
      .then(data => {
        data.map((item, index) => (item.index = index + 1));
        if (type === 0) {   // 大类
          this.setState({
            mTypes: [{ id: 0, name: '配件大类' }, ...data],
            mItems: data
          });
        } else {
          this.setState({
            mItems: data
          });
        }
      })
      .catch(error => {
        message.error(error.message);
      });
  }

  removeData(id) {
    HttpUtil.get(ApiUtil.API_PART_DELETE + id)
      .then(
        re => {
          let code = re.code;
          if (code < 0) {
            throw new Error(re.message)
          }
          message.info(re.message);
          let items = ArrayUtil.deleteItem(this.state.mItems, id);
          this.setState({ mItems: items });
        }
      ).catch(error => {
        message.error(error.message);
      });
  }

  componentDidMount() {
    this.getData(this.currentType);
  }


  renderDialog() {
    if (this.state.showInfoDialog) {
      return (
        <DevicePartDialog
          visible={this.state.showInfoDialog}
          part={this.state.currentItem}
          itemTypes={this.state.mTypes}
          onClose={() => this.setState({ showInfoDialog: false })}
          onDialogConfirm={this.onDialogConfirm}
        />
      );
    }
  }

  getTypeName(id) {
    for (let i = 0; i < this.state.mTypes.length; i++) {
      let item = this.state.mTypes[i];
      if (item.id === id) {
        return item.name;
      }
    }
  }

  renderBreadcrumb() {
    let style = { display: 'inline-block', fontSize: '16px', cursor: "pointer", color: '#1890ff' };
    if (this.currentType === 0) {
      return (<Breadcrumb style={style}>
        <Breadcrumb.Item>配件大类</Breadcrumb.Item></Breadcrumb>);
    } else {
      return (<Breadcrumb style={style}>
        <Breadcrumb.Item onClick={() => this.handleFilterChange(0)}>
          <Icon type='left' style={{ marginRight: '6px' }} />
          配件大类
        </Breadcrumb.Item>
        <Breadcrumb.Item>{this.getTypeName(this.currentType)}</Breadcrumb.Item>
      </Breadcrumb>);
    }
  }

  renderColumns() {
    if (this.currentType === 0) {
      let array = [...this.columns];
      array.splice(2, 3);
      return array;
    } else {
      return this.columns;
    }
  }


  render() {
    return (
      <div>
        <div style={{ display: 'flex', paddingTop: 10, alignItems: 'center' }}>
          {this.renderBreadcrumb()}

          <Button
            type="primary"
            icon="plus"
            onClick={() => this.showUpdateDialog()}
            style={{ marginLeft: 'auto' }}
          >
            添加
          </Button>
        </div>
        <Table
          style={{ marginTop: 10 }}
          dataSource={this.state.mItems}
          rowKey={item => item.id}
          columns={this.renderColumns()}
          pagination={false}
        />

        {this.renderDialog()}

      </div>
    );
  }

  // 点击行
  onItemClick = item => {
    if (this.currentType === 0) {
      this.handleFilterChange(item.id);
    } else {
      this.showUpdateDialog(item);
    }
  }


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
      // 如果不在当前类别下就刷新，不然就在当前页动态添加。
      if (part.sid !== this.currentType) {
        this.handleFilterChange(part.sid)
      } else {
        part.id = newId;
        part.index = this.state.mItems.length + 1;
        let datas = [...this.state.mItems];
        datas.push(part);
        this.setState({
          mItems: datas
        });
        if (part.sid === 0) {
          let types = [...this.state.mTypes];
          types.push(part);
          this.setState({
            mTypes: types
          })
        }
      }
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
        sid: this.currentType
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
