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
        <Menu.Item key="2" icon={<ContainerOutlined />}>
          <Link to="/feed">Feed</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<SettingOutlined />}>
          <Link to="/shipments">Shipments</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<SettingOutlined />}>
          <Link to="/customer-management-settings">
            Customer Management Settings
          </Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<SettingOutlined />}>
          <Link to="/vessel-settings">Vessel Settings</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
