import React from "react";
import {
  Modal,
  Form,
  Input,
  message
} from "antd";
import ApiUtil from "../Utils/ApiUtil";
import HttpUtil from "../Utils/HttpUtil";

class StoreDialog extends React.Component {
  state = {
    confirmLoading: false,
  };

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error("表单数据有误，请根据提示填写！");
      } else {
        this.setState({
          confirmLoading: true
        });
        HttpUtil.post(ApiUtil.API_STORE_UPDATE, values)
          .then(
            re => {
              message.info(re.message);
              this.setState({
                confirmLoading: false,
              });
              this.props.onDialogConfirm(values);
            }
          ).catch(error => {
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

  render() {
    // 受控组件，visible完全由props确定，不要既外面又自己，容易混乱。
    //console.log('dialog render: ' + user.name + "," + visible);
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title={"修改门店信息"}
        visible={true}
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

            <Form.Item label="公司名" {...styles.formItem2Col}>
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "请输入公司名！" }]
              })(<Input placeholder="" />)}
            </Form.Item>

            <Form.Item label="地址" {...styles.formItem2Col}>
              {getFieldDecorator("address", {
                rules: [{ required: true, message: "请输入地址！" }]
              })(<Input placeholder="" />)}
            </Form.Item>

            <Form.Item label="联系人" {...styles.formItem2Col}>
              {getFieldDecorator("user", {
                rules: [{ required: true, message: "请输入联系人！" }]
              })(<Input placeholder="" />)}
            </Form.Item>

            <Form.Item label="电话" {...styles.formItem2Col}>
              {getFieldDecorator("phone", {
                rules: [{ required: true, message: "请输入电话！" }]
              })(<Input placeholder="" />)}
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
    if (!props.store) {
      return;
    }
    return objToForm(props.store);
  }
})(StoreDialog);

export default mForm;
