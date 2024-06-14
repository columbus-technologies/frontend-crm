import React, { useEffect, useState } from "react";
import { Card, Typography, Table, Button, message, Modal } from "antd";
import { ShipmentResponse } from "../types";
import {
  getAllShipments,
  createShipment,
  updateShipment,
  deleteShipment,
} from "../api";
import "../styles/index.css"; // Ensure the CSS file is imported
import MultiStepShipmentModal from "../components/modals/MultiStepShipmentModal";
// import { useNavigate } from "react-router-dom";
import UnauthorizedModal from "../components/modals/UnauthorizedModal";

const { Title } = Typography;

const ShipmentsManagement: React.FC = () => {
  const [shipments, setShipments] = useState<ShipmentResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);
  // const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const data = await getAllShipments();
      console.log("Fetched shipments:", data); // Debugging statement
      setShipments(data);
      setErrorMessage(null);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Unauthorized") {
          setIsUnauthorizedModalVisible(true);
        }
        console.log(error.message);
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
    console.log(`Attempting to delete shipment with ID: ${id}`); // Debugging statement
    try {
      await deleteShipment(id);
      fetchData(); // Refresh the table data after deletion
      message.success("Shipment deleted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to delete shipment:", error.message);
        message.error("Failed to delete shipment. Please try again.");
      }
    }
  };

  const handleModalOpen = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    fetchData(); // Refresh the table data after creation
  };

  // const handleUnauthorizedModalOk = () => {
  //   setIsUnauthorizedModalVisible(false);
  //   navigate("/login");
  // };

  const columns = [
    { title: "Date Created", dataIndex: "created_at", key: "created_at" },
    {
      title: "ETA Status",
      dataIndex: "ETA",
      key: "eta_status",
      render: (eta: string) => (
        <div>{new Date(eta) > new Date() ? "Upcoming" : "Past"}</div>
      ),
    },
    {
      title: "IMO Number",
      dataIndex: ["vessel_specifications", "imo_number"],
      key: "imo_number",
    },
    {
      title: "Voyage Number",
      dataIndex: "voyage_number",
      key: "voyage_number",
    },
    {
      title: "Vessel",
      dataIndex: ["vessel_specifications", "vessel_name"],
      key: "vessel_name",
    },
    {
      title: "Customer Name(s)",
      dataIndex: ["activity"],
      key: "customer_names",
      render: (activities: any[]) =>
        activities.map((activity) => (
          <div key={activity.customer_specifications.customer}>
            {activity.customer_specifications.customer}
          </div>
        )),
    },
    {
      title: "Terminal Location(s)",
      dataIndex: ["activity"],
      key: "terminal_location",
      render: (activities: any[]) =>
        activities.map((activity) => (
          <div key={activity.terminal_location}>
            {activity.terminal_location}
          </div>
        )),
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: ShipmentResponse) => {
        console.log("Record:", record); // Debugging statement
        return (
          <Button type="primary" danger onClick={() => handleDelete(record.ID)}>
            Delete
          </Button>
        );
      },
    },
  ];

  return (
    <div className="shipments-management-container">
      <Title level={2} className="shipments-management-title">
        Shipments Management
      </Title>
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button type="primary" onClick={handleModalOpen}>
          Add Shipment
        </Button>
      </div>
      <Card>
        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <Table dataSource={shipments} columns={columns} rowKey="ID" />
        )}
      </Card>
      <MultiStepShipmentModal
        visible={isModalVisible}
        onCancel={handleModalClose}
        onCreate={handleModalClose}
      />
      <UnauthorizedModal
        visible={isUnauthorizedModalVisible}
        onClose={() => setIsUnauthorizedModalVisible(false)}
      />
    </div>
  );
};

export default ShipmentsManagement;
