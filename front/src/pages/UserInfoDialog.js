import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  message
} from "antd";
import CommonValues from "../Utils/CommonValues";
import ApiUtil from "../Utils/ApiUtil";
import HttpUtil from "../Utils/HttpUtil";

class UserInfoDialog extends React.Component {
  state = {
    confirmLoading: false,
    currentType: this.props.user.role
  };

  userTypes = [{ id: 0, name: '' }, ...CommonValues.userTypes];

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error("表单数据有误，请根据提示填写！");
      } else {
        this.setState({
          confirmLoading: true
        });

        HttpUtil.post(ApiUtil.API_USER_UPDATE, values)
          .then(
            re => {
              console.log('post result: ', re.newId);
              message.info(re.message);
              this.setState({
                confirmLoading: false,
              });
              this.props.onDialogConfirm(values, re.newId);
            }
          ).catch(error => {
            message.error(error.message);
          });

        console.log('Received values of form: ', values);
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
      callback('请选择用户类别！');
    } else {
      callback();
    }
  };
  
  renderPwd(getFieldDecorator) {
    console.log("userType: " + this.props.user.role);
    if (this.state.currentType !== CommonValues.TYPE_REPAIRMAN) {
      return (
        <Form.Item label="密码" {...styles.formItem2Col}>
          {getFieldDecorator("pwd", {
            rules: [{ required: true, message: "请输入用户密码！" }]
          })(<Input type='password' placeholder="" />)}
        </Form.Item>);
    }
  }

  render() {
    // 受控组件，visible完全由props确定，不要既外面又自己，容易混乱。
    //const {confirmLoading, user } = this.state;

    const { getFieldDecorator } = this.props.form;

    //console.log('dialog render: ' + user.name + "," + visible);

    return (
      <Modal
        title={this.props.user.id > 0 ? "修改用户信息" : "添加新用户"}
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

            <Form.Item label="用户类别" {...styles.formItemLayout}>
              {getFieldDecorator("role", {
                rules: [{ validator: this.checkSelectEmpty },{ required: true}]
              })(
                <Select
                  style={{ width: 160 }}
                  onChange={value => this.setState({ currentType: value })}
                >
                  {this.userTypes.map(item => (
                    <Select.Option value={item.id} key={item.id + ""}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item label="用户名" {...styles.formItem2Col}>
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "请输入用户名！" }]
              })(<Input placeholder="" />)}
            </Form.Item>

            {this.renderPwd(getFieldDecorator)}

            <Form.Item label="电话" {...styles.formItem2Col}>
              {getFieldDecorator("phone")(<Input placeholder="请输入手机号" />)}
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

// 使用Form.create处理后的表单具有自动收集数据并校验的功能, 如果不需要可以不用。
// 经过Form.create()包装过的组件会自带this.props.form属性，
// this.props.form提供了很多API来处理数据，如getFieldDecorator——用于和表单进行双向绑定等
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
