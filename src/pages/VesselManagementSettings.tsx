import React, { useEffect, useState } from "react";
import { Card, Typography, Table, Button, message, Modal } from "antd";
import { VesselResponse } from "../types";
import { fetchVessels, deleteVessel } from "../api";
import "../styles/index.css"; // Ensure the CSS file is imported
// import { useNavigate } from "react-router-dom";
import AddVesselModal from "../components/modals/AddVesselSettingsModal";
import UnauthorizedModal from "../components/modals/UnauthorizedModal";
import { formatDateToLocalString } from "../utils/dateTimeUtils";

const { Title } = Typography;

const VesselManagementSettings: React.FC = () => {
  const [vessels, setVessels] = useState<VesselResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);
  // const navigate = useNavigate();

  const loadVessels = async () => {
    try {
      const data = await fetchVessels();
      console.log(data);
      setVessels(data);
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
    loadVessels(); // Initial fetch
  }, []);

  // const handleUnauthorizedModalOk = () => {
  //   setIsUnauthorizedModalVisible(false);
  //   navigate("/login");
  // };

  const columns = [
    { title: "IMO Number", dataIndex: "imo_number", key: "imo_number" },
    { title: "Vessel Name", dataIndex: "vessel_name", key: "vessel_name" },
    { title: "Call Sign", dataIndex: "call_sign", key: "call_sign" },
    { title: "SDWT", dataIndex: "sdwt", key: "sdwt" },
    { title: "NRT", dataIndex: "nrt", key: "nrt" },
    { title: "Flag", dataIndex: "flag", key: "flag" },
    { title: "GRT", dataIndex: "grt", key: "grt" },
    { title: "LOA", dataIndex: "loa", key: "loa" },
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
      render: (text: string, record: VesselResponse) => (
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
      console.log(`Deleting vessel with ID: ${id}`); // Debugging deletion

      await deleteVessel(id);
      loadVessels();
      message.success("Vessel deleted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to delete vessel:", error.message);
        message.error("Failed to delete vessel. Please try again.");
      }
    }
  };

  return (
    <div className="settings-management-container">
      <Title level={2} className="settings-management-title">
        Vessel Settings
      </Title>
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button type="primary" onClick={showModal}>
          Add Vessel Setting
        </Button>
      </div>
      <Card>
        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <Table dataSource={vessels} columns={columns} />
        )}
      </Card>
      <AddVesselModal
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        loadVessels={loadVessels}
      />
      <UnauthorizedModal
        visible={isUnauthorizedModalVisible}
        onClose={() => setIsUnauthorizedModalVisible(false)}
      />
    </div>
  );
};

export default VesselManagementSettings;
