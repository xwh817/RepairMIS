import React from 'react';

import {
    Select, Table, Icon, Button, message, Input, Modal
} from 'antd';


export default class OrderManger extends React.Component {
    columns = [{
        title: '序号',
        width: 80,
        align: 'center',
        render: (text, record, index) => (<span>{index+1}</span>)
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
        render: (job) => (
            <span>
                <Icon type="edit" title="编辑" onClick={() => this.showUpdateDialog(job)} />
                <Icon type="close" title="删除" style={{ color: '#ee6633', marginLeft: 12 }} onClick={() => this.deleteConfirm(job)} />
            </span>
        ),
    }];

    state = {
        mJobs: [],
        showAddDialog: false,
        job: {}
    };


    componentDidMount() {
        //this.getData();
    }


    render() {
        return (
            <div>               
                <div>
                    <Select style={{ width: 240, marginRight: 20, marginTop: 4 }} defaultValue={this.state.jobSelected} onChange={this.handleFilterChange}>
                        {this.state.mJobs.map((item) => <Select.Option value={item.id} key={item.id + ''}>{item.id > 0 ? item.name : '所有类别'}</Select.Option>)}
                    </Select>

                    <Button type="primary" icon="plus" onClick={() => this.showUpdateDialog()} style={{ float: 'right', marginTop: 4 }}>添加</Button>
                </div>
                <Table
                    style={{ marginTop: 10 }}
                    dataSource={this.props.jobList}
                    rowKey={item => item.id}
                    columns={this.columns}
                    pagination={false} />

                <Modal
                    title={this.state.job.id ? "修改订单" : "添加订单"}
                    okText="保存"
                    cancelText="取消"
                    visible={this.state.showAddDialog}
                    onOk={this.handleAdd}
                    onCancel={() => this.setState({ showAddDialog: false })}>
                    <Input type='text'
                        onChange={this.handleTextChanged}
                        value={this.state.job.name}
                        placeholder="客户名" />

                </Modal>
            </div>
        )
    }

    showUpdateDialog = (job) => {
        if (job === undefined) {
            job = {
                id: 0,
                name: ''
            };
        }
        let currentJob = Object.assign({}, this.state.job, job);     // 对象赋值，同时注意不要给state直接赋值，先追加到空对象{}
        this.setState({
            showAddDialog: true,
            job: currentJob
        });
    }

    handleAdd = () => {
    }

    handleTextChanged = (e) => {
        //console.log(e.target.value);
    }

    deleteConfirm = (job) => {
        
    }

}