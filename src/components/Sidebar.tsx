import React from "react";
import { Layout, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  ContainerOutlined,
  SettingOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateShipment = () => {
    navigate("/create-shipment");
  };

  return (
    <Sider collapsible>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          cursor: "pointer",
          color: "white",
        }}
        onClick={handleCreateShipment}
      >
        <PlusOutlined style={{ fontSize: "24px" }} />
      </div>
      <Menu theme="dark" mode="inline">
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        {/* <Menu.Item key="2" icon={<ContainerOutlined />}>
          <Link to="/feed">Feed</Link>
        </Menu.Item> */}
        <Menu.Item key="2" icon={<SettingOutlined />}>
          <Link to="/shipments">Shipments</Link>
        </Menu.Item>
        <SubMenu key="settings" icon={<SettingOutlined />} title="Settings">
          <Menu.Item key="3">
            <Link to="/customer-management-settings">
              Customer Management Settings
            </Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/vessel-management-settings">Vessel Settings</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/agent-management-settings">Agent Settings</Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link to="/terminal-management-settings">Terminal Settings</Link>
          </Menu.Item>
          <Menu.Item key="7">
            <Link to="/supplier-management-settings">Supplier Settings</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="categories" icon={<SettingOutlined />} title="Categories">
          <Menu.Item key="8">
            <Link to="/activity-types">Activity Types</Link>
          </Menu.Item>
          <Menu.Item key="9">
            <Link to="/product-types">Product Types</Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
