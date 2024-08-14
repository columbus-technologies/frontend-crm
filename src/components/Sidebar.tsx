import React, { useState } from "react";
import { Button, Layout, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  SettingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import MultiStepShipmentModal from "./modals/MultiStepShipmentModal";

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState("0"); // Default selected key
  const navigate = useNavigate();

  const handleCreateShipment = () => {
    setIsModalVisible(true); // Show the modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Hide the modal
    setSelectedKey("2"); // Update the selected key to "Shipments"
    navigate("/shipments"); // Navigate to the Shipments page
  };

  return (
    <>
      <Sider collapsible>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            marginTop: "55px", // Adjust this to control spacing
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{
              backgroundColor: "#0D9488", // Deep grey: #64748B
              borderColor: "#64748B",
              color: "#FFFFFF",
              width: "100%", // Expand the button horizontally
            }}
            onClick={handleCreateShipment}
          >
            <b> New Shipment </b>
          </Button>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          style={{ flex: "1 1 auto" }}
          selectedKeys={[selectedKey]} // Set the selected key
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/dashboard" onClick={() => setSelectedKey("1")}>
              Dashboard
            </Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<SettingOutlined />}>
            <Link to="/shipments" onClick={() => setSelectedKey("2")}>
              Shipments
            </Link>
          </Menu.Item>
          <SubMenu key="settings" icon={<SettingOutlined />} title="Settings">
            <Menu.Item key="3">
              <Link
                to="/customer-management-settings"
                onClick={() => setSelectedKey("3")}
              >
                Customer Management Settings
              </Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link
                to="/vessel-management-settings"
                onClick={() => setSelectedKey("4")}
              >
                Vessel Settings
              </Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link
                to="/agent-management-settings"
                onClick={() => setSelectedKey("5")}
              >
                Agent Settings
              </Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link
                to="/terminal-management-settings"
                onClick={() => setSelectedKey("6")}
              >
                Terminal Settings
              </Link>
            </Menu.Item>
            <Menu.Item key="7">
              <Link
                to="/supplier-management-settings"
                onClick={() => setSelectedKey("7")}
              >
                Supplier Settings
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="categories"
            icon={<SettingOutlined />}
            title="Categories"
          >
            <Menu.Item key="8">
              <Link to="/activity-types" onClick={() => setSelectedKey("8")}>
                Activity Types
              </Link>
            </Menu.Item>
            <Menu.Item key="9">
              <Link to="/product-types" onClick={() => setSelectedKey("9")}>
                Product Types
              </Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <MultiStepShipmentModal
        visible={isModalVisible}
        onCancel={handleModalClose}
        onCreate={handleModalClose}
      />
    </>
  );
};

export default Sidebar;
