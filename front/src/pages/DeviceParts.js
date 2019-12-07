import React from 'react';
import {
    Select, Table, Icon, Button, message, Input, Modal
} from 'antd';
import ApiUtil from '../Utils/ApiUtil';
import HttpUtil from '../Utils/HttpUtil';


export default class DeviceParts extends React.Component {
    columns = [{
        title: '序号',
        dataIndex: 'index',
        width: 80,
        align: 'center'
    },
    {
        title: '产品名称',
        dataIndex: 'name',
    }, {
        title: '单位',
        dataIndex: 'unit',
    }, {
        title: '单价',
        dataIndex: 'price',
    }, {
        title: '备注',
        dataIndex: 'remarks',
    }, {
        title: '编辑',
        align: 'center',
        width: 160,
        render: (currentItem) => (
            <span>
                <Icon type="edit" title="编辑" onClick={() => this.showUpdateDialog(currentItem)} />
                <Icon type="close" title="删除" style={{ color: '#ee6633', marginLeft: 12 }} onClick={() => this.deleteConfirm(currentItem)} />
            </span>
        ),
    }];

    state = {
        mParts: [],
        showAddDialog: false,
        currentItem: {},
        mPartTypes:[
            {id:0, name:'所有'},
            {id:1, name:'电器部分'},
            {id:2, name:'液压部分'},
            {id:3, name:'其他易损件部分'},
        ],
        type: 0,
    };

    getData() {
        HttpUtil.get(ApiUtil.API_GET_PARTS + this.state.type)
            .then(
                data => {
                    data.map((item, index) => {
                        item.index = index + 1;
                        return item;
                    });
                    this.setState({
                        mParts: data
                    });
                }
            ).catch(error => {
                message.error(error.message);
            });
    }

    componentDidMount() {
        this.getData();
    }


    render() {
        return (
            <div>
                <div>
                    <Select style={{ width: 240, marginRight: 20, marginTop: 4 }} defaultValue={this.state.type} onChange={this.handleFilterChange}>
                        {this.state.mPartTypes.map((item) => <Select.Option value={item.id} key={item.id + ''}>{item.id > 0 ? item.name : '所有类别'}</Select.Option>)}
                    </Select>

                    <Button type="primary" icon="plus" onClick={() => this.showUpdateDialog()} style={{ float: 'right', marginTop: 4 }}>添加</Button>
                </div>
                <Table
                    style={{ marginTop: 10 }}
                    dataSource={this.state.mParts}
                    rowKey={item => item.id}
                    columns={this.columns}
                    pagination={false} />

                <Modal
                    title={this.state.currentItem.id ? "修改配件" : "添加配件"}
                    okText="保存"
                    cancelText="取消"
                    visible={this.state.showAddDialog}
                    onOk={this.handleAdd}
                    onCancel={() => this.setState({ showAddDialog: false })}>
                    <Input type='text'
                        onChange={this.handleTextChanged}
                        value={this.state.currentItem.name}
                        placeholder="配件名" />

                </Modal>
            </div>
        )
    }

    handleFilterChange = (type) => {
        this.setState({
            type:type,
        })
        this.getData()
    }

    showUpdateDialog = (item) => {
        if (item === undefined) {
            item = {
                id: 0,
                name: ''
            };
        }
        let currentItem = Object.assign({}, this.state.currentItem, item);     // 对象赋值，同时注意不要给state直接赋值，先追加到空对象{}
        this.setState({
            showAddDialog: true,
            currentItem: currentItem
        });
    }

    handleAdd = () => {
    }

    handleTextChanged = (e) => {
        //console.log(e.target.value);
    }

    deleteConfirm = (currentItem) => {

    }

}