import React from 'react';

import {
    Select, Table, Icon, Button, message, Input, Modal
} from 'antd';
import ApiUtil from '../Utils/ApiUtil';
import HttpUtil from '../Utils/HttpUtil';


export default class RepairItems extends React.Component {
    columns = [{
        title: '序号',
        width: 80,
        align: 'center',
        render: (text, record, index) => (<span>{index+1}</span>)
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
                <Icon type="close" title="删除" style={{ color: '#ee6633', marginLeft: 12 }} onClick={() => this.deleteConfirm(item)} />
            </span>
        ),
    }];

    state = {
        mTypes: [],
        mItems: [],
        //currentType: 0,
        currentItem: {},
        showAddDialog: false,
    };


    getData(type) {
        HttpUtil.get(ApiUtil.API_GET_REPAIR_ITEMS + type)
            .then(
                data => {
                    if (type === 0) {   // 大类
                        this.setState({
                            mTypes: [{ id: 0, name: '大类' }, ...data],
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

    componentDidMount() {
        this.getData(0);
    }


    render() {
        return (
            <div>

                <div>
                    <Select style={{ width: 240, marginRight: 20, marginTop: 4 }} defaultValue={0} onChange={this.handleFilterChange}>
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

                <Modal
                    title={this.state.currentItem.id ? "修改维修项目" : "添加维修项目"}
                    okText="保存"
                    cancelText="取消"
                    visible={this.state.showAddDialog}
                    onOk={this.handleAdd}
                    onCancel={() => this.setState({ showAddDialog: false })}>
                    <Input type='text'
                        onChange={this.handleTextChanged}
                        value={this.state.currentItem.name}
                        placeholder="配件名" />
                    <Input type='text'
                        onChange={this.handleTextChanged}
                        value={this.state.currentItem.price}
                        placeholder="单价" />
                    <Input type='text'
                        onChange={this.handleTextChanged}
                        value={this.state.currentItem.remarks}
                        placeholder="备注" />

                </Modal>
            </div>
        )
    }

    handleFilterChange = (type) => {
        /* this.setState({
            currentType: type,
        }); */
        this.getData(type)
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

    deleteConfirm = (item) => {

    }

}