import React from 'react';

import {
  Select, Table, Icon, Button, message, Input, Modal, DatePicker
} from 'antd';
import ApiUtil from '../Utils/ApiUtil';
import HttpUtil from '../Utils/HttpUtil';
import OrderDialog from "./OrderDialog";


export default class OrderManger extends React.Component {
  columns = [{
    title: '序号',
    dataIndex: 'index',
    width: 80,
    align: 'center'
  },
  {
    title: '型号',
    dataIndex: 'type',
  }, {
    title: '客户名',
    dataIndex: 'name',
  }, {
    title: '服务工程师',
    dataIndex: 'service',
  }, {
    title: '日期',
    dataIndex: 'datetime',
  }, {
    title: '备注',
    dataIndex: 'remarks',
  }, {
    title: '编辑',
    align: 'center',
    width: 160,
    render: (item) => (
      <span>
        <Icon type="edit" title="编辑" onClick={() => this.showDialog(item)} />
        <Icon type="close" title="删除" style={{ color: '#ee6633', marginLeft: 20 }} onClick={() => this.deleteConfirm(item)} />
      </span>
    ),
  }];

  state = {
    repairItems: [],
    repairStaffs: [],
    currentItem: {},
    orderList: [],
    showInfoDialog: false,
  };


  componentDidMount() {
    this.getData();
  }


  getData() {
    HttpUtil.get(ApiUtil.API_GET_REPAIR_ITEMS + 0)
      .then(
        data => {
          this.setState({
            repairItems: data,
          });
        }
      )
      .then(() => HttpUtil.get(ApiUtil.API_GET_USERS + 4))
      .then(
        data => {
          this.setState({
            repairStaffs: data,
          });
        }
      )
      .catch(error => {
        message.error(error.message);
      });
  }

  searchItems = {};

  handleTextChange = (e) => {
    let attr = e.target.getAttribute('item');
    if (attr) {
      this.searchItems[attr] = e.target.value;
      console.log(attr + ":" + e.target.value);
    }
  }

  handleSearch = () => {

  }

  handleDataChange = (date, dateString) => {
    console.log(date, dateString);
  }

  
  renderDialog(){
    if (this.state.showInfoDialog) {
      return (
        <OrderDialog
          visible={this.state.showInfoDialog}
          order={this.state.currentItem}
          repairItems={this.state.repairItems}
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
          <Input placeholder="订单号" item="id" prefix={<Icon type="account-book" style={styles.prefixIcon} />} style={styles.searchItem} onChange={this.handleTextChange} />

          <Select placeholder="维修项目" style={styles.select} onChange={this.handleFilterChange}>
            {this.state.repairItems.map(item => <Select.Option value={item.id} key={item.id + ''}>{item.name}</Select.Option>)}
          </Select>
          <Select placeholder="服务工程师" style={styles.select} onChange={this.handleFilterChange}>
            {this.state.repairStaffs.map(item => <Select.Option value={item.id} key={item.id + ''}>{item.name}</Select.Option>)}
          </Select>
          <Input placeholder="客户名" item="name" prefix={<Icon type="user" style={styles.prefixIcon} />} style={styles.searchItem} onChange={this.handleTextChange} />
          <DatePicker.RangePicker format={'YYYY.MM.DD'} style={{ width: 220, marginRight: 6 }} onChange={this.handleDataChange} />

          <Button type="primary" icon="search" onClick={this.handleSearch}>搜索</Button>
          <Button type="primary" icon="plus" onClick={() => this.showDialog()} style={{ float: 'right', marginTop: 4 }}>添加</Button>
        </div>
        <Table
          style={{ marginTop: 10 }}
          dataSource={this.props.orderList}
          rowKey={item => item.id}
          columns={this.columns}
          pagination={false} />

        {this.renderDialog()}
      </div>
    )
  }

  
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

}


const styles = {
  select: {
    width: 160,
    marginRight: 6,
    marginTop: 4
  },
  searchItem: {
    width: 160,
    marginTop: 4,
    marginRight: 6,
  },
  prefixIcon: {
    color: 'rgba(0,0,0,.25)',
  },
  divider: {
    marginTop: 4,
    marginBottom: 8,
  }
}
