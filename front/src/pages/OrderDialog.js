import React from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  TreeSelect,
  message,
  Divider
} from "antd";
import ApiUtil from "../Utils/ApiUtil";
import HttpUtil from "../Utils/HttpUtil";
import CommonValues from "../Utils/CommonValues";

class OrderDialog extends React.Component {
  initData() {
    let data = this.props.repairItems.map(item => {
      item.title = item.name;
      item.value = item.id + "";
    });
    return this.props.repairItems;
  }
  state = {
    confirmLoading: false,
    repairItems: this.initData()
  };

  partTypes = [{ id: 0, name: "" }, ...CommonValues.partTypes];

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

  genTreeNode = (parentId, isLeaf = false) => {
    const random = Math.random()
      .toString(36)
      .substring(2, 6);
    return {
      id: random,
      pId: parentId,
      value: random,
      title: isLeaf ? "Tree Node" : "Expand to load",
      isLeaf
    };
  };

  onLoadTreeData = treeNode =>
    new Promise(resolve => {
      const { id } = treeNode.props;
      setTimeout(() => {
        this.setState({
          repairItems: this.state.repairItems.concat([
            this.genTreeNode(id, false),
            this.genTreeNode(id, true)
          ])
        });
        resolve();
      }, 300);
    });

  renderTreeSelect(getFieldDecorator) {
    return (
      <Form.Item label="维修项目" {...styles.formItemLayout}>
        {getFieldDecorator("role")(
          <TreeSelect
            treeDataSimpleMode
            style={{ width: 160 }}
            value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            placeholder="添加维修项目"
            onChange={value => this.setState({ value })}
            loadData={this.onLoadTreeData}
            treeData={this.state.repairItems}
          />
        )}
      </Form.Item>
    );
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
        okText="保存"
        cancelText="取消"
      >
        <div>
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <Form.Item {...styles.formItem2Col}>
              {getFieldDecorator("id")(<Input type="hidden" />)}
            </Form.Item>
            客户信息：
            <Divider />
            <Form.Item label="客户名" {...styles.formItem2Col}>
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "请输入客户名！" }]
              })(<Input placeholder="" />)}
            </Form.Item>
            产品信息：
            <Form.Item label="配件名" {...styles.formItem2Col}>
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "请输入配件名！" }]
              })(<Input placeholder="" />)}
            </Form.Item>
            {this.renderTreeSelect(getFieldDecorator)}
            <Form.Item label="备注" {...styles.formItem2Col}>
              {getFieldDecorator("remarks")(<Input />)}
            </Form.Item>
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
