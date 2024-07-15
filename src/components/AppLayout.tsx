import React from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const { Header, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the JWT token and redirect to the login page
    // implement invalidating jwtToken as well
    sessionStorage.removeItem("jwtToken");
    navigate("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Dropdown overlay={menu} trigger={["click"]}>
            <Avatar
              style={{ backgroundColor: "#87d068", marginRight: "16px" }}
              icon={<UserOutlined />}
            />
          </Dropdown>
        </Header>
        <Content style={{ margin: "0 16px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
