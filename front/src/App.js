import React, { Component } from "react";

import "antd/dist/antd.css";
import "./App.css";
import myIcon from "./images/icon.jpg";

import { Layout, Menu, Icon, Avatar } from "antd";

import BaseInfoPage from "./pages/BaseInfoPage";
import UserManager from "./pages/UserManager";
import RepairItems from "./pages/RepairItems";
import DeviceParts from "./pages/DeviceParts";
import OrderManager from "./pages/OrderManager";

const { Content, Footer, Sider } = Layout;

class App extends Component {
  state = {
    collapsed: false,
    currentPage: "1"
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  getPageByMenu() {
    switch (this.state.currentPage) {
      case "1":
        return <BaseInfoPage />;
      case "2":
        return <UserManager />;
      case "3":
        return <RepairItems />;
      case "4":
        return <DeviceParts />;
      case "5":
        return <OrderManager />;
      case "6":
        return <OrderManager />;
      default:
        return <BaseInfoPage/>
    }
  }

  menus = [
    { key: "1", title: "门店信息", icon: "home" },
    { key: "2", title: "用户管理", icon: "team" },
    { key: "3", title: "维修项目", icon: "tool" },
    { key: "4", title: "配件", icon: "setting" },
    { key: "5", title: "维修单", icon: "account-book" },
    { key: "6", title: "数据备份", icon: "database" }
  ];

  renderMenuItem = item => {
    return (
      <Menu.Item key={item.key}>
        <Icon type={item.icon} />
        <span>{item.title}</span>
      </Menu.Item>
    );
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          width={152}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div
            className="logo"
            style={{
              height: 80,
              backgroundColor: "#002140",
              textAlign: "center"
            }}
          >
            <Avatar
              src={myIcon}
              alt=""
              style={{ width: 60, height: 60, marginTop: 10 }}
            />
          </div>

          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[this.state.currentPage]}
            onSelect={({ key }) => this.setState({ currentPage: key })}
          >
            {this.menus.map(item => this.renderMenuItem(item))}
          </Menu>
        </Sider>

        <Layout>
          {/* <Header style={{ margin: '0 16px', background: '#fff', padding: 0 }} /> */}
          <Content style={{ margin: "12px 12px" }}>
            <div style={{ padding: 24, background: "#fff", minHeight: 620 }}>
              {this.getPageByMenu()}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Repair Manager Information System ©2019 Created by XWH
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
