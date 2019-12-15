import React from 'react';
import ApiUtil from '../Utils/ApiUtil';
import HttpUtil from '../Utils/HttpUtil';

import {
    Button, message,
} from 'antd';


export default class DataManager extends React.Component {
    state = {
        showDownload: false,
    }

    exportData = () => {
        HttpUtil.get(ApiUtil.API_FILE_BACKUP)
            .then(
                re => {
                    if (re.code >= 0) {
                        this.setState({
                            showDownload: true
                        });
                        message.info('保存成功');
                    } else { message.info('保存失败'); }

                }
            ).catch(error => {
                message.error(error.message);
            });
    }

    render() {
        let style = { display: 'inline-block', marginTop: '24px' };
        return <div>
            <div style={{ margin: '0 auto', width: 300, paddingTop:24 }}>
                <Button type="dashed" icon="download" style={style}>下载所有订单数据</Button>
                <Button type="dashed" icon="download" style={style}>下载所有维修项目数据</Button>
                <Button type="dashed" icon="download" style={style}>下载所有配件数据</Button>
            </div>
        </div>
    }

}