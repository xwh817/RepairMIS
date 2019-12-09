import React, { Component } from 'react';

import 'antd/dist/antd.css';
import './App.css';
import myIcon from './images/icon.jpg';

import {
  Layout, Menu, Icon, Avatar,
} from 'antd';

import UserManager from './pages/UserManager';
import RepairItems from './pages/RepairItems';
import DeviceParts from './pages/DeviceParts';
import OrderManager from './pages/OrderManager';


const {
  Content, Footer, Sider,
} = Layout;

class App extends Component {
  state = {
    collapsed: false,
    currentPage: '1',
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  getPageByMenu() {
    let key = this.state.currentPage;
    switch(key) {
      case '1': return <UserManager/>;break;
      case '2': return <RepairItems/>;break;
      case '3': return <DeviceParts/>;break;
      case '4': return <OrderManager/>;break;
    }
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh'}}>
        <Sider
        width={152}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" style={{height:80,backgroundColor:"#002140", textAlign: 'center'}}>
            <Avatar src={myIcon} alt='' style={{width:60, height:60, marginTop:10}}/>
          </div>

          <Menu theme="dark"  mode="inline"
            defaultSelectedKeys={[this.state.currentPage]} 
            onSelect={({key}) => this.setState({currentPage:key})}>
            <Menu.Item key="1">
              <Icon type="team" />
              <span>用户管理</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="cluster" />
              <span>维修项目</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="database" />
              <span>配件</span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="database" />
              <span>维修单</span>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout>
          {/* <Header style={{ margin: '0 16px', background: '#fff', padding: 0 }} /> */}
          <Content style={{ margin: '12px 12px' }}>
           
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              {this.getPageByMenu()}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center'}}>
            Loving you forever ©2019 Created by XWH
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
