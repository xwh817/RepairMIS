import React from 'react';

import {
  Select, Table, Icon, Button, message, Modal
} from 'antd';
import ApiUtil from '../Utils/ApiUtil';
import HttpUtil from '../Utils/HttpUtil';
import RepairItemDialog from './RepairItemDialog';
import ArrayUtil from "../Utils/ArrayUtil";

export default class RepairItems extends React.Component {
  columns = [{
    title: '序号',
    dataIndex: 'index',
    width: 80,
    align: 'center'
  },
  {
    title: '维修项目',
    dataIndex: 'name',
  }, {
    title: '工时标价',
    dataIndex: 'price',
    width: 150,
    align: 'center',
    render: (item) => (<span>{item > 0 ? item : ''}</span>),
  }, {
    title: '备注',
    dataIndex: 'remarks',
  }, {
    title: '编辑',
    align: 'center',
    width: 160,
    render: (item) => (
      <span>
        <Icon type="edit" title="编辑" onClick={() => this.showUpdateDialog(item)} />
        <Icon type="close" title="删除" style={{ color: '#ee6633', marginLeft: 20 }} onClick={() => this.deleteConfirm(item)} />
      </span>
    ),
  }];

  state = {
    mTypes: [{ id: 0, name: '项目大类' }],
    mItems: [],
    currentItem: {},
    showInfoDialog: false,
  };

  currentType = 0;

  getData(type) {
    HttpUtil.get(ApiUtil.API_GET_REPAIR_ITEMS + type)
      .then(
        data => {
          data.map((item, index) => item.index = index + 1);
          if (type === 0) {   // 大类
            this.setState({
              mTypes: [{ id: 0, name: '项目大类' }, ...data],
              mItems: data
            });
          } else {
            this.setState({
              mItems: data
            });
          }

        }
      ).catch(error => {
        message.error(error.message);
      });
  }


  removeData(id) {
    HttpUtil.get(ApiUtil.API_REPAIR_ITEM_DELETE + id)
      .then(
        re => {
          let code = re.code;
          if (code < 0) {
            throw new Error(re.message)
          }
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
        <RepairItemDialog
          visible={this.state.showInfoDialog}
          repairItem={this.state.currentItem}
          itemTypes={this.state.mTypes}
          onClose={() => this.setState({ showInfoDialog: false })}
          onDialogConfirm={this.onDialogConfirm}
        />
      );
    }
  }

  render() {
    return (
      <div>

        <div>
          <Select style={{ width: 240, marginRight: 20, marginTop: 4 }}
            defaultValue={this.currentType}
            onChange={this.handleFilterChange}>
            {this.state.mTypes.map((item) => <Select.Option value={item.id} key={item.id + ''}>{item.name}</Select.Option>)}
          </Select>

          <Button type="primary" icon="plus" onClick={() => this.showUpdateDialog()} style={{ float: 'right', marginTop: 4 }}>添加</Button>
        </div>

        <Table
          style={{ marginTop: 10 }}
          dataSource={this.state.mItems}
          rowKey={item => item.id}
          columns={this.columns}
          pagination={false} />

        {this.renderDialog()}

      </div>
    )
  }

  onDialogConfirm = (repairItem, newId) => {
    this.setState({
      showInfoDialog: false
    });

    if (repairItem.id) { // 修改
      let datas = [...this.state.mItems];
      ArrayUtil.replaceItem(datas, repairItem);
      this.setState({
        mItems: datas
      });
    } else {    // 新增
      repairItem.id = newId;
      repairItem.index = this.state.mItems.length+1;
      let datas = [...this.state.mItems];
      datas.push(repairItem);
      this.setState({
        mItems: datas
      });
    }
  }

  handleFilterChange = (type) => {
    this.currentType = type;
    this.getData(type)
  }

  showUpdateDialog = (item) => {
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
  }

  deleteConfirm = item => {
    var that = this;    // 下面的内嵌对象里面，this就改变了，这里在外面存一下。
    Modal.confirm({
      title: '确认',
      content: '确定要删除该项目吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.removeData(item.id);
      },
      onCancel() { },
    });
  };

}