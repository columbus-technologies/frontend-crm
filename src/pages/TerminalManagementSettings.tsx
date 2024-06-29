import React, { useEffect, useState } from "react";
import { Card, Typography, Table, Button, message } from "antd";
import { TerminalResponse } from "../types";
import { getAllTerminals, deleteTerminal } from "../api";
import "../styles/index.css"; // Ensure the CSS file is imported
// import { useNavigate } from "react-router-dom";
import AddTerminalModal from "../components/modals/AddTerminalSettingsModal";
import UnauthorizedModal from "../components/modals/UnauthorizedModal";

const { Title } = Typography;

const TerminalManagementSettings: React.FC = () => {
  const [terminals, setTerminals] = useState<TerminalResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);
  // const navigate = useNavigate();

  const loadTerminals = async () => {
    try {
      const data = await getAllTerminals();
      console.log(data);
      setTerminals(data);
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
    loadTerminals(); // Initial fetch
  }, []);

  // const handleUnauthorizedModalOk = () => {
  //   setIsUnauthorizedModalVisible(false);
  //   navigate("/login");
  // };

  const columns = [
    { title: "Terminal Name", dataIndex: "name", key: "name" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    {
      title: "Action",
      key: "action",
      render: (record: TerminalResponse) => (
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
      console.log(`Deleting Terminal with ID: ${id}`); // Debugging deletion

      await deleteTerminal(id);
      loadTerminals();
      message.success("Terminal deleted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to delete Terminal:", error.message);
        message.error("Failed to delete Terminal. Please try again.");
      }
    }
  };

  return (
    <div className="settings-management-container">
      <Title level={2} className="settings-management-title">
        Terminal Settings
      </Title>
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button type="primary" onClick={showModal}>
          Add Terminal Setting
        </Button>
      </div>
      <Card>
        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <Table dataSource={terminals} columns={columns} />
        )}
      </Card>
      <AddTerminalModal
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        loadTerminals={loadTerminals}
      />
      <UnauthorizedModal
        visible={isUnauthorizedModalVisible}
        onClose={() => setIsUnauthorizedModalVisible(false)}
      />
    </div>
  );
};

export default TerminalManagementSettings;
