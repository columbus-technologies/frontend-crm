import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Spin,
} from "antd";
import { Customer, CustomerResponse } from "../types";
import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api";
import "../styles/index.css"; // Ensure the CSS file is imported

const { Title } = Typography;

const CustomerManagementSettings: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCustomers();
      console.log("Fetched customers:", data); // Debugging statement
      setCustomers(data);
      setErrorMessage(null);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(String(error));
      }
      console.error("There was an error!", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
  }, []); // Empty dependency array means this effect runs once on mount

  const handleDelete = async (id: string) => {
    console.log(`Attempting to delete customer with ID: ${id}`); // Debugging statement
    try {
      await deleteCustomer(id);
      message.success("Customer deleted successfully!");
      fetchData(); // Refresh the table data after deletion
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to delete customer:", error.message);
        message.error("Failed to delete customer. Please try again.");
      }
    }
  };

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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Convert the fields to appropriate types
      const payload: Customer = {
        ...values,
      };

      console.log("Payload before sending to backend:", payload); // Debugging payload

      // Perform the API call to save the new customer
      await createCustomer(payload);

      // Refresh the table data
      fetchData();

      setIsModalVisible(false);
      form.resetFields();
      message.success("Customer added successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to add customer:", error.message);
        message.error("Failed to add customer. Please try again.");
      }
    }
  };

  const handleCancel = () => {
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
        ) : isLoading ? (
          <Spin size="large" />
        ) : (
          <Table dataSource={customers} columns={columns} rowKey="id" />
        )}
      </Card>
      <Modal
        title="Add Customer"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="custom-modal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="customer"
            label="Customer"
            rules={[
              { required: true, message: "Please input the Customer name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="company"
            label="Company"
            rules={[{ required: true, message: "Please input the Company!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input the Email!" }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="contact"
            label="Contact"
            rules={[{ required: true, message: "Please input the Contact!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerManagementSettings;
