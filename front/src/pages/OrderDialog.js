import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  List,
  Cascader,
  message,
  Table,
  Icon,
  InputNumber
} from "antd";
import ApiUtil from "../Utils/ApiUtil";
import HttpUtil from "../Utils/HttpUtil";
import CommonValues from "../Utils/CommonValues";
import ArrayUtil from "../Utils/ArrayUtil";

class OrderDialog extends React.Component {
  initData() {
    this.props.repairItems.forEach(item => this.setTreeData(item, false));
    return this.props.repairItems;
  }
  state = {
    confirmLoading: false,
    repairItems: this.initData(),
    selectedRepairItems: [],
    parts: [],
    selectedParts: []
  };

  partTypes = [{ id: 0, name: "" }, ...CommonValues.partTypes];

  // 生成符合要求的数据
  setTreeData(item, isLeaf) {
    item.label = item.name;
    item.value = item.id + "";
    item.isLeaf = isLeaf;
    return item;
  }

  componentDidMount() {
    this.onLoadPartData();
  }

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error("表单数据有误，请根据提示填写！");
      } else {
        this.setState({
          confirmLoading: true
        });

        HttpUtil.post(ApiUtil.API_PART_UPDATE, values)
          .then(re => {
            console.log("post result: ", re.newId);
            message.info(re.message);
            this.setState({
              confirmLoading: false
            });
            this.props.onDialogConfirm(values, re.newId);
          })
          .catch(error => {
            message.error(error.message);
          });
      }
    });
  };

  handleCancel = () => {
    this.props.onClose();
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log("handleSubmit");
  };

  checkSelectEmpty = (rule, value, callback) => {
    if (value === 0) {
      callback("请选择配件类别！");
    } else {
      callback();
    }
  };

  onLoadRepairItemData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    let id = targetOption.id;
    targetOption.loading = true;
    HttpUtil.get(ApiUtil.API_GET_REPAIR_ITEMS + id).then(data => {
      data.forEach(item => this.setTreeData(item, true));
      targetOption.loading = false;
      targetOption.children = data;
      this.setState({
        repairItems: [...this.state.repairItems]
      });
    });
  };

  onLoadPartData = selectedOptions => {
    if (selectedOptions === undefined) {
      HttpUtil.get(ApiUtil.API_GET_PARTS + 0).then(data => {
        data.forEach(item => this.setTreeData(item, false));
        this.setState({
          parts: data
        });
      });
    } else {
      let targetOption = selectedOptions[selectedOptions.length - 1];
      let id = targetOption.id;
      targetOption.loading = true;
      HttpUtil.get(ApiUtil.API_GET_PARTS + id).then(data => {
        targetOption.loading = false;
        data.forEach(item => this.setTreeData(item, true));
        targetOption.children = data;
        this.setState({
          parts: [...this.state.parts]
        });
      });
    }
  };

  displayRender = labels => labels[labels.length - 1];

  renderTreeSelect() {
    return (
      <Form.Item
        label="添加维修项目"
        {...styles.formItemLayout}
        style={{ marginBottom: 4 }}
      >
        <Cascader
          style={{ width: 250 }}
          placeholder="点击添加维修项"
          value={""}
          onChange={(value, selectedOptions) => {
            let item = selectedOptions[selectedOptions.length - 1];
            console.log(value + "  " + JSON.stringify(item));
            this.setState({
              selectedRepairItems: [...this.state.selectedRepairItems, item]
            });
          }}
          loadData={this.onLoadRepairItemData}
          options={this.state.repairItems}
          displayRender={this.displayRender}
        />
      </Form.Item>
    );
  }

  renderRepairItems() {
    if (this.state.selectedRepairItems.length > 0) {
      return (
        <Table
          size={"small"}
          style={{ marginLeft: 30, width:600}}
          pagination={false}
          columns={[
            { title: "维修项目", dataIndex: "name", key: "name" },
            { title: "价格", dataIndex: "price", key: "price", align:"center" },
            {
              title: "删除", align:"center",
              render: item =>
                <Icon
                  type="close"
                  title="删除"
                  style={{ color: "#ee6633", marginLeft: 20 }}
                  onClick={() =>
                    this.setState({
                      selectedRepairItems: ArrayUtil.deleteItem(
                        this.state.selectedRepairItems,
                        item.id
                      )
                    })
                  }
                />
            }
          ]}
          dataSource={this.state.selectedRepairItems}
        />
      );
    }
  }

  renderPartSelect() {
    return (
      <Form.Item
        label="添加配件材料"
        {...styles.formItemLayout}
        style={{ marginTop: 24, marginBottom: 4 }}
      >
        <Cascader
          style={{ width: 250 }}
          placeholder="点击添加材料"
          value={""}
          onChange={(value, selectedOptions) => {
            let item = selectedOptions[selectedOptions.length - 1];
            console.log(value + "  " + JSON.stringify(item));
            item.count = 1;
            this.setState({
              selectedParts: [...this.state.selectedParts, item]
            });
          }}
          loadData={this.onLoadPartData}
          options={this.state.parts}
          displayRender={this.displayRender}
        />
      </Form.Item>
    );
  }

  renderParts() {
    if (this.state.selectedParts.length > 0) {
      return (
        <Table
          size={"small"}
          style={{ marginLeft: 30, width:600}}
          pagination={false}
          columns={[
            { title: "材料", dataIndex: "name", key: "name" },
            { title: "单位", dataIndex: "unit", key: "unit", align:"center" },
            { title: "数量", dataIndex: "count", key: "count", align:"center", 
              render: count => <InputNumber value={count} onChange={value=>{
                console.log('num: ' + value)
              }} />},
            { title: "单价", dataIndex: "price", key: "price", align:"center" },
            {
              title: "删除", align:"center",
              render: item =>
                <span><Icon
                  type="close"
                  title="删除"
                  style={{ color: "#ee6633", marginLeft: 20 }}
                  onClick={() =>
                    this.setState({
                      selectedParts: ArrayUtil.deleteItem(
                        this.state.selectedParts,
                        item.id
                      )
                    })
                  }
                /></span>
            }
          ]}
          dataSource={this.state.selectedParts}
        />
      );
    }
  }

  render() {
    // 受控组件，visible完全由props确定，不要既外面又自己，容易混乱。
    //console.log('dialog render: ' + user.name + "," + visible);
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title={this.props.order.id > 0 ? "修改订单" : "添加订单"}
        visible={this.props.visible}
        style={{ top: 20 }}
        width={800}
        onOk={this.handleOk}
        confirmLoading={this.state.confirmLoading}
        onCancel={this.handleCancel}
        onClose={this.props.onClose}
        maskClosable={false}
        okText="生成订单"
        cancelText="取消"
      >
        <div>
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <Form.Item {...styles.formItem2Col}>
              {getFieldDecorator("id")(<Input type="hidden" />)}
            </Form.Item>
            <Form.Item label="客户名" {...styles.formItem2Col}>
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "请输入客户名！" }]
              })(<Input placeholder="" />)}
            </Form.Item>
            <Form.Item label="型号" {...styles.formItem2Col}>
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "请输入型号！" }]
              })(<Input placeholder="" />)}
            </Form.Item>
            <Form.Item label="服务工程师" {...styles.formItem2Col}>
              <Select
                placeholder="选择工程师"
                /* mode="multiple" */
                onChange={this.handleFilterChange}
              >
                {this.props.staffs.map(item => (
                  <Select.Option value={item.id} key={item.id + ""}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {this.renderTreeSelect()}
            {this.renderRepairItems()}

            {this.renderPartSelect()}
            {this.renderParts()}

          </Form>
        </div>
      </Modal>
    );
  }
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

const objToForm = obj => {
  let target = {};
  // Object.entries 返回其可枚举属性的键值对的对象。
  for (let [key, value] of Object.entries(obj)) {
    target[key] = Form.createFormField({ value });
  }
  return target;
};

// 将父控件的props属性值绑定的form，双休关联。
// 使用Form.create处理后的表单具有自动收集数据并校验的功能, 如果不需要可以不用。
// 经过Form.create()包装过的组件会自带this.props.form属性，
// this.props.form提供了很多API来处理数据，如getFieldDecorator——用于和表单进行双向绑定等
const mForm = Form.create({
  name: "infoForm",
  mapPropsToFields(props) {
    if (!props.order) {
      return;
    }
    return objToForm(props.order);
  }
})(OrderDialog);

export default mForm;
