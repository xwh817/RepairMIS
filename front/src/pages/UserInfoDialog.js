import React from "react";
import {
  Modal,
  Form,
  Icon,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  message
} from "antd";

class UserInfoDialog extends React.Component {
  state = {
    visible: false,
    confirmLoading: false,
    user: {},
    userTypes: [],
    deleteConfirm: false
  };

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error("表单数据有误，请根据提示填写！");
      } else {
        this.setState({
          confirmLoading: true
        });
      }
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log("handleSubmit");
  };

  render() {
    const { visible, confirmLoading, user } = this.state;

    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title="信息编辑"
        visible={visible}
        style={{ top: 20 }}
        width={800}
        onOk={this.handleOk}
        confirmLoading={confirmLoading}
        onCancel={this.handleCancel}
        afterClose={this.props.afterClose}
        okText="保存"
        cancelText="取消"
      >
        <div>
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <Form.Item {...styles.formItem2Col}>
              {getFieldDecorator("id")(<Input type="hidden" />)}
            </Form.Item>

            <Form.Item label="用户名" {...styles.formItem2Col}>
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "请输入用户名!" }]
              })(<Input placeholder="" />)}
            </Form.Item>

            <Form.Item label="用户类别" {...styles.formItemLayout}>
              {getFieldDecorator("typeName")(
                <Select
                  style={{ width: 140 }}
                  onChange={value => console.log(value)}
                >
                  {this.state.userTypes.map(item => (
                    <Select.Option value={item.id} key={item.id + ""}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
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

const mForm = Form.create({
  name: "infoForm",
  mapPropsToFields(props) {
    if (!props.user) {
      return;
    }
    return objToForm(props.user);
  }
})(UserInfoDialog);

export default mForm;
