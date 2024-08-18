import React, { useState, useEffect } from "react";
import { Button, Layout, Menu } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const [collapsed, setCollapsed] = useState(false); // State to track sidebar collapse
  const navigate = useNavigate();
  const location = useLocation(); // Get the current path

  useEffect(() => {
    // Set selectedKey based on the current path
    switch (location.pathname) {
      case "/dashboard":
        setSelectedKey("1");
        break;
      case "/shipments":
        setSelectedKey("2");
        break;
      case "/customer-management-settings":
        setSelectedKey("3");
        break;
      case "/vessel-management-settings":
        setSelectedKey("4");
        break;
      case "/agent-management-settings":
        setSelectedKey("5");
        break;
      case "/terminal-management-settings":
        setSelectedKey("6");
        break;
      case "/supplier-management-settings":
        setSelectedKey("7");
        break;
      case "/activity-types":
        setSelectedKey("8");
        break;
      case "/product-types":
        setSelectedKey("9");
        break;
      default:
        setSelectedKey("0");
        break;
    }
  }, [location.pathname]); // Update selectedKey whenever the path changes

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
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
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
              textAlign: "left", // Align the text to the left
              paddingLeft: "16px", // Add padding to the left
            }}
            onClick={handleCreateShipment}
          >
            {!collapsed && <b> New Shipment </b>}{" "}
            {/* Show text only when not collapsed */}
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
