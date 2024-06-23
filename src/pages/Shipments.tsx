import React, { useEffect, useState } from "react";
import { Card, Typography, Table, Button, message, Tag } from "antd";
import { ShipmentResponse } from "../types";
import { getAllShipments, deleteShipment } from "../api";
import "../styles/index.css"; // Ensure the CSS file is imported
import MultiStepShipmentModal from "../components/modals/MultiStepShipmentModal";
import UnauthorizedModal from "../components/modals/UnauthorizedModal";
import { useStatusColours } from "../context/StatusColoursContext"; // Import the context
import { formatDateToLocalString } from "../utils/dateTimeUtils";

const { Title } = Typography;

const ShipmentsManagement: React.FC = () => {
  const [shipments, setShipments] = useState<ShipmentResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);
  const statusColours = useStatusColours();

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

  const columns = [
    {
      title: "Date Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => formatDateToLocalString(date),
    },
    {
      title: "Status",
      dataIndex: "current_status",
      key: "current_status",
      render: (status: string) => (
        <Tag color={statusColours[status] || "default"}>{status}</Tag>
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
      dataIndex: "shipment_type",
      key: "customer_name",
      render: (shipment_type: any) => {
        const cargoActivities =
          shipment_type?.cargo_operations?.cargo_operations_activity || [];
        const bunkeringActivities =
          shipment_type?.bunkering?.bunkering_activity || [];

        return (
          <>
            {cargoActivities.map((activity: any, index: number) => (
              <div key={`cargo-${index}`}>{activity.customer_name}</div>
            ))}
            {bunkeringActivities.map((activity: any, index: number) => (
              <div key={`bunkering-${index}`}>{activity.customer_name}</div>
            ))}
          </>
        );
      },
    },
    {
      title: "Activity",
      dataIndex: "shipment_type",
      key: "activity",
      render: (shipment_type: any) => {
        const cargoOperations =
          shipment_type?.cargo_operations?.cargo_operations;
        const bunkering = shipment_type?.bunkering?.bunkering;

        if (cargoOperations && bunkering) {
          return (
            <>
              <div>cargo_operations</div>
              <div>bunkering</div>
            </>
          );
        } else if (cargoOperations) {
          return <div>cargo_operations</div>;
        } else if (bunkering) {
          return <div>bunkering</div>;
        } else {
          return <div>No activity</div>;
        }
      },
    },
    {
      title: "Agent Assigned",
      dataIndex: ["shipment_details", "agent_details"],
      key: "agent_details",
      render: (agent_details: any) => (
        <div>
          <div>{agent_details.name}</div>
          {/* <div>{agent_details.contact}</div> */}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: ShipmentResponse) => {
        return (
          <Button type="primary" danger onClick={() => handleDelete(record.ID)}>
            Delete
          </Button>
        );
      },
    },
  ];

  return (
    <div className="settings-management-container">
      <Title level={2} className="settings-management-title">
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
