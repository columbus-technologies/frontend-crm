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
import { Agent, AgentResponse } from "../types";
import { getAllAgents, createAgent, deleteAgent } from "../api";
import "../styles/index.css"; // Ensure the CSS file is imported
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const AgentManagementSettings: React.FC = () => {
  const [agents, setAgents] = useState<AgentResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);
  const navigate = useNavigate();

  const loadAgents = async () => {
    try {
      const data = await getAllAgents();
      console.log("Fetched agents:", data); // Debugging statement
      setAgents(data);
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
    loadAgents(); // Initial fetch
  }, []);

  const handleUnauthorizedModalOk = () => {
    setIsUnauthorizedModalVisible(false);
    navigate("/login");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    { title: "Created At", dataIndex: "created_at", key: "created_at" },
    { title: "Updated At", dataIndex: "updated_at", key: "updated_at" },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: AgentResponse) => (
        <Button type="primary" danger onClick={() => handleDelete(record.ID)}>
          Delete
        </Button>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload: Agent = {
        ...values,
      };

      console.log("Form values:", payload);

      await createAgent(payload);

      loadAgents();

      setIsModalVisible(false);
      form.resetFields();
      message.success("Agent added successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to add agent setting:", error.message);
        if (error.message === "Duplicate key error") {
          message.error("Agent with this email already exists.");
        } else {
          message.error("Server error. Please try again.");
        }
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    try {
      console.log(`Deleting agent with ID: ${id}`); // Debugging deletion

      await deleteAgent(id);
      loadAgents();
      message.success("Agent deleted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to delete agent:", error.message);
        message.error("Failed to delete agent. Please try again.");
      }
    }
  };

  return (
    <div className="agent-management-settings-container">
      <Title level={2} className="agent-management-settings-title">
        Agent Settings
      </Title>
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button type="primary" onClick={showModal}>
          Add Agent
        </Button>
      </div>
      <Card>
        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <Table dataSource={agents} columns={columns} />
        )}
      </Card>
      <Modal
        title="Add Agent"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="custom-modal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the Name!" }]}
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

export default AgentManagementSettings;
