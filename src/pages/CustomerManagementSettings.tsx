import React, { useEffect, useState } from "react";
import { Card, Typography, Table, Button, message, Modal } from "antd";
import { CustomerResponse } from "../types";
import { getAllCustomers, deleteCustomer } from "../api";
import "../styles/index.css"; // Ensure the CSS file is imported
// import { useNavigate } from "react-router-dom";
import AddCustomerModal from "../components/modals/AddCustomerSettingsModal";
import UnauthorizedModal from "../components/modals/UnauthorizedModal";

const { Title } = Typography;

const CustomerManagementSettings: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);
  // const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const data = await getAllCustomers();
      console.log("Fetched customers:", data); // Debugging statement
      setCustomers(data);
      setErrorMessage(null);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Unauthorized") {
          setIsUnauthorizedModalVisible(true);
        }
        setErrorMessage(error.message);
      } else {
        setErrorMessage(String(error));
      }
      console.error("There was an error!", error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
  }, []); // Empty dependency array means this effect runs once on mount

  const handleDelete = async (id: string) => {
    console.log(`Attempting to delete customer with ID: ${id}`); // Debugging statement
    try {
      await deleteCustomer(id);
      fetchData(); // Refresh the table data after deletion
      message.success("Customer deleted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to delete customer:", error.message);
        message.error("Failed to delete customer. Please try again.");
      }
    }
  };

  // const handleUnauthorizedModalOk = () => {
  //   setIsUnauthorizedModalVisible(false);
  //   navigate("/login");
  // };

  const columns = [
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "Company", dataIndex: "company", key: "company" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    { title: "Created At", dataIndex: "created_at", key: "created_at" },
    { title: "Updated At", dataIndex: "updated_at", key: "updated_at" },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: CustomerResponse) => {
        console.log("Record:", record); // Debugging statement
        return (
          <Button type="primary" danger onClick={() => handleDelete(record.ID)}>
            Delete
          </Button>
        );
      },
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="customer-management-settings-container">
      <Title level={2} className="customer-management-settings-title">
        Customer Management
      </Title>
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button type="primary" onClick={showModal}>
          Add Customer
        </Button>
      </div>
      <Card>
        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <Table dataSource={customers} columns={columns} rowKey="ID" />
        )}
      </Card>
      <AddCustomerModal
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        fetchData={fetchData}
      />
      <UnauthorizedModal
        visible={isUnauthorizedModalVisible}
        onClose={() => setIsUnauthorizedModalVisible(false)}
      />
    </div>
  );
};

export default CustomerManagementSettings;
