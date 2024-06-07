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
} from "antd";
import { Customer, CustomerResponse } from "../types";
import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api";
import "../styles/index.css"; // Ensure the CSS file is imported
import { useNavigate } from "react-router-dom";
import ContactInput from "../util/ContactNumberCountryCodeInput";

const { Title } = Typography;

const CustomerManagementSettings: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);
  const navigate = useNavigate();

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

  const handleUnauthorizedModalOk = () => {
    setIsUnauthorizedModalVisible(false);
    navigate("/login");
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
        contact: values.phoneCode + values.contact,
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
        if (error.message === "Duplicate key error") {
          message.error("Customer with this name already exists.");
        } else {
          message.error("Server error. Please try again.");
        }
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
          <Form.Item label="Contact">
            <ContactInput />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Credentials Expired"
        visible={isUnauthorizedModalVisible}
        maskClosable={false}
        footer={[
          <Button key="ok" type="primary" onClick={handleUnauthorizedModalOk}>
            OK
          </Button>,
        ]}
      >
        <p>Credentials Expired. Please login again.</p>
      </Modal>
    </div>
  );
};

export default CustomerManagementSettings;
