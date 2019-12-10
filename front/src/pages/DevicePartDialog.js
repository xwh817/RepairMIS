import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  message
} from "antd";
import ApiUtil from "../Utils/ApiUtil";
import HttpUtil from "../Utils/HttpUtil";

class DevicePartDialog extends React.Component {
  state = {
    confirmLoading: false,
    part: {},
    currentType: 0,
    deleteConfirm: false
  };


  // 将父控件中props的变化转化为当前state
  componentWillReceiveProps(newProps) {
    if (newProps.part && this.state.part.id !== newProps.part.id) {
      this.setState({ 
        part: newProps.part,
        currentType: newProps.part.sType,
       });
    }
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
          .then(
            re => {
              console.log('post result: ', re.newId);
              message.info(re.message);
            }
          ).catch(error => {
            message.error(error.message);
          });

        console.log('Received values of form: ', values);
        setTimeout(() => {
          this.setState({
            confirmLoading: false,
          });
          this.props.onDialogConfirm(values);
        }, 1000);
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


  renderPrice(getFieldDecorator) {
    if (this.state.currentType != 0) {
      return (
        <Form.Item label="单价" {...styles.formItem2Col}>
        {getFieldDecorator("price")(<Input type='number' placeholder="请输入单价（单位：元）" />)}
      </Form.Item>);
    }
  }


  render() {
    // 受控组件，visible完全由props确定，不要既外面又自己，容易混乱。
    //console.log('dialog render: ' + user.name + "," + visible);
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title={this.props.part.id > 0 ? "修改配件" : "添加新配件"}
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

            <Form.Item label="配件类别" {...styles.formItemLayout}>
              {getFieldDecorator("sType", {
                rules: [{ required: true, message: "请选择配件类别！" }]
              })(
                <Select
                  style={{ width: 160 }}
                  onChange={value => this.setState({ currentType: value })}
                >
                  {this.props.partTypes.map(item => (
                    <Select.Option value={item.id} key={item.id + ""}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item label="配件名" {...styles.formItem2Col}>
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "请输入配件名！" }]
              })(<Input placeholder="" />)}
            </Form.Item>

            <Form.Item label="单位" {...styles.formItem2Col}>
              {getFieldDecorator("unit")(<Input />)}
            </Form.Item>

            {this.renderPrice(getFieldDecorator)}

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
    if (!props.part) {
      return;
    }
    return objToForm(props.part);
  }
})(DevicePartDialog);

export default mForm;
