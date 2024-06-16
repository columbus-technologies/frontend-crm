import React, { useEffect, useState } from "react";
import { Card, Typography, Table, Button, Modal, message } from "antd";
import { AgentResponse } from "../types";
import { getAllAgents, deleteAgent } from "../api";
import "../styles/index.css";
import { useNavigate } from "react-router-dom";
import AddAgentModal from "../components/modals/AddAgentSettingsModal";
import UnauthorizedModal from "../components/modals/UnauthorizedModal";
import { formatDateToLocalString } from "../utils/dateTimeUtils";

const { Title } = Typography;

const AgentManagementSettings: React.FC = () => {
  const [agents, setAgents] = useState<AgentResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);

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

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => formatDateToLocalString(date),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date: string) => formatDateToLocalString(date),
    },
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

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
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
    <div className="settings-management-container">
      <Title level={2} className="settings-management-title">
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
      <AddAgentModal
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        loadAgents={loadAgents}
      />
      <UnauthorizedModal
        visible={isUnauthorizedModalVisible}
        onClose={() => setIsUnauthorizedModalVisible(false)}
      />
    </div>
  );
};

export default AgentManagementSettings;
