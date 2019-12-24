import React from "react";

import {
  Select,
  Table,
  Icon,
  Button,
  message,
  Input,
  Modal,
  DatePicker,
  Spin
} from "antd";
import ApiUtil from "../Utils/ApiUtil";
import HttpUtil from "../Utils/HttpUtil";
import OrderDialog from "./OrderDialog";
import ArrayUtil from "../Utils/ArrayUtil";

export default class OrderManger extends React.Component {
  columns = [
    {
      title: "序号",
      dataIndex: "index",
      width: 80,
      align: "center"
    },
    {
      title: "订单号",
      width: 120,
      dataIndex: "sn"
    },
    {
      title: "客户名",
      dataIndex: "client_name"
    },
    {
      title: "型号",
      dataIndex: "client_model"
    },
    {
      title: "服务工程师",
      width: 120,
      dataIndex: "staff"
    },
    /* {
      title: "日期",
      dataIndex: "create_time"
    }, */
    {
      title: "操作",
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
            type="file-excel"
            title="下载Excel"
            style={{ color: "#167919", marginLeft: 20 }}
            onClick={() => {
              const w = window.open("about:blank");
              w.location.href =
                ApiUtil.API_ORDER_FILE + item.id + "/" + new Date().getTime();
            }}
          />
          <Icon
            type="close"
            title="删除"
            style={{ color: "#ee6633", marginLeft: 20 }}
            onClick={() => this.deleteConfirm(item)}
          />
        </span>
      )
    }
  ];

  state = {
    repairItems: [],
    repairStaffs: [],
    currentItem: {},
    orderList: [],
    showInfoDialog: false,
    loading: true
  };

  deviceTypes = [
    { id: 0, name: "" },
    { id: 1, name: "三一重工" },
    { id: 2, name: "2222" },
    { id: 3, name: "3333" }
  ];

  componentDidMount() {
    this.getData();
  }

  getData() {
    HttpUtil.get(ApiUtil.API_GET_REPAIR_ITEMS + 0)
      .then(data => {
        this.setState({
          repairItems: data
        });
      })
      .then(() => HttpUtil.get(ApiUtil.API_GET_USERS + 4))
      .then(data => {
        data = [{ id: 0, name: "" }, ...data]
        this.setState({
          repairStaffs: data
        });
      })
      .then(() => HttpUtil.get(ApiUtil.API_GET_ORDERS))
      .then(data => {
        data.map((item, index) => (item.index = index + 1));
        //console.log("orderList: " + JSON.stringify(data));
        this.setState({
          orderList: data,
          loading: false
        });
      })
      .catch(error => {
        message.error(error.message);
        this.setState({ loading: false });
      });
  }

  removeData(id) {
    HttpUtil.get(ApiUtil.API_ORDER_DELETE + id)
      .then(re => {
        message.info(re.message);
        let items = ArrayUtil.deleteItem(this.state.orderList, id);
        this.setState({ orderList: items });
      })
      .catch(error => {
        message.error(error.message);
      });
  }

  searchItems = {};

  handleTextChange = e => {
    let attr = e.target.getAttribute("item");
    if (attr) {
      this.searchItems[attr] = e.target.value;
      console.log(attr + ":" + e.target.value);
    }
  };

  handleSelectChange = (attr, value) => {
    if (value === '') {
      delete this.searchItems[attr];
    } else {
      this.searchItems[attr] = value;
    }
    
    console.log(attr + ":" + value);
  }

  handleDateChange = (dates, dateStrings) => {
    if (dates.length === 0) {
      delete this.searchItems['startDate'];
      delete this.searchItems['endDate'];
    } else {
      this.searchItems['startDate'] = dates[0].startOf('day').format('YYYY-MM-DD')
      this.searchItems['endDate'] = dates[1].endOf('day').format('YYYY-MM-DD')
    }
    console.log(JSON.stringify(this.searchItems));
  };


  handleSearch = () => {
    let where = JSON.stringify(this.searchItems);
    /* if (where  === "{}") {
      message.error('请输入搜索条件！', 1);
      return;
    } */
    let url = ApiUtil.API_ORDER_SEARCH + "?where=" + encodeURI(where);
    this.setState({ loading: true });
    HttpUtil.get(url)
      .then(data => {
        if (data.length === 0) {
          message.info('没有搜索到内容', 1);
        }
        data.map((item, index) => (item.index = index + 1));
        this.setState({
          orderList: data,
          loading: false
        });
      })
      .catch(error => {
        message.error(error.message);
        this.setState({ loading: false });
      });
  };

  renderDialog() {
    if (this.state.showInfoDialog) {
      return (
        <OrderDialog
          visible={this.state.showInfoDialog}
          order={this.state.currentItem}
          repairItems={this.state.repairItems}
          staffs={this.state.repairStaffs}
          onClose={() => this.setState({ showInfoDialog: false })}
          onDialogConfirm={this.onDialogConfirm}
        />
      );
    }
  }

  render() {
    return (
      <div style={{ paddingTop: 16 }}>
        <div>
          <DatePicker.RangePicker
            format={"YYYY.MM.DD"}
            style={{ width: 220, marginRight: 6 }}
            onChange={this.handleDateChange}
          />

          <Input
            placeholder="订单号"
            item="sn"
            prefix={<Icon type="account-book" style={styles.prefixIcon} />}
            style={styles.searchItem}
            onChange={this.handleTextChange}
          />

          {/* <Select placeholder="维修项目" style={styles.select} onChange={this.handleFilterChange}>
            {this.state.repairItems.map(item => <Select.Option value={item.id} key={item.id + ''}>{item.name}</Select.Option>)}
          </Select> */}

          {/* <Select
            placeholder="型号"
            style={styles.select}
            onChange={value => this.handleSelectChange('client_model', value)}
          >
            {this.deviceTypes.map(item => (
              <Select.Option value={item.name} key={item.id + ""} style={{ height: 30 }}>
                {item.name}
              </Select.Option>
            ))}
          </Select> */}
          <Input
            placeholder="型号"
            item="client_model"
            prefix={<Icon type="tool" style={styles.prefixIcon} />}
            style={styles.searchItem}
            onChange={this.handleTextChange}
          />
          <Select
            placeholder="服务工程师"
            style={styles.select}
            onChange={value => this.handleSelectChange('staff', value)}
          >
            {this.state.repairStaffs.map(item => (
              <Select.Option value={item.name} key={item.id + ""} style={{ height: 30 }}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
          <Input
            placeholder="客户名"
            item="client_name"
            prefix={<Icon type="user" style={styles.prefixIcon} />}
            style={styles.searchItem}
            onChange={this.handleTextChange}
          />

          <Button type="primary" icon="search" onClick={this.handleSearch}>
            搜索
          </Button>
          <Button
            type="primary"
            icon="plus"
            onClick={() => this.showDialog()}
            style={{ float: "right", marginTop: 4 }}
          >
            新建
          </Button>
        </div>
        <Spin spinning={this.state.loading} size="large" delay={500}>
          <Table
            style={{ marginTop: 10 }}
            dataSource={this.state.orderList}
            rowKey={item => item.id}
            columns={this.columns}
            pagination={true}
          />
        </Spin>

        {this.renderDialog()}
      </div>
    );
  }

  showDialog = item => {
    let currentItem = item;
    if (item === undefined) {
      currentItem = {
        id: 0,
        name: "",
        role: this.currentType,
        pwd: "",
        phone: ""
      };
    }
    this.setState({
      currentItem: currentItem,
      showInfoDialog: true
    });
  };

  onDialogConfirm = (order, newId, newSN) => {
    this.setState({
      showInfoDialog: false
    });

    if (order.id) {
      // 修改
      let datas = [...this.state.orderList];
      console.log(JSON.stringify(order));
      ArrayUtil.replaceItem(datas, order);
      this.setState({
        orderList: datas
      });
    } else {
      // 新增
      order.id = newId;
      order.sn = newSN;
      order.index = this.state.orderList.length + 1;
      let datas = [...this.state.orderList];
      //order.create_time = new Date().format("yyyy-MM-dd");
      datas.push(order);
      this.setState({
        orderList: datas
      });
    }
  };

  deleteConfirm = item => {
    var that = this; // 下面的内嵌对象里面，this就改变了，这里在外面存一下。
    Modal.confirm({
      title: "确认",
      content: "确定要删除该订单吗？",
      okText: "确认",
      cancelText: "取消",
      onOk() {
        that.removeData(item.id);
      },
      onCancel() {}
    });
  };
}

const styles = {
  select: {
    width: 140,
    marginRight: 6,
    marginTop: 4
  },
  searchItem: {
    width: 150,
    marginTop: 4,
    marginRight: 6
  },
  prefixIcon: {
    color: "rgba(0,0,0,.25)"
  },
  divider: {
    marginTop: 4,
    marginBottom: 8
  }
};
