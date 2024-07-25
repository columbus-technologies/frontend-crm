import React, { useEffect, useState } from "react";
import { Card, Typography, Table, Button, Tag, Input, Select } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { ShipmentResponse } from "../types";
import { getAllShipments } from "../api";
import "../styles/index.css"; // Ensure the CSS file is imported
import MultiStepShipmentModal from "../components/modals/MultiStepShipmentModal";
import UnauthorizedModal from "../components/modals/UnauthorizedModal";
import { useStatusColours } from "../context/StatusColoursContext"; // Import the context
import { formatDateToLocalString } from "../utils/dateTimeUtils";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const ShipmentsManagement: React.FC = () => {
  const [shipments, setShipments] = useState<ShipmentResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filter, setFilter] = useState<string>("All");

  const statusColours = useStatusColours();
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchData = async () => {
    try {
      const data = await getAllShipments();
      console.log("Fetched shipments:", data); // Debugging statement
      const sortedData = data.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setShipments(sortedData);
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

  const handleView = (id: string) => {
    navigate(`/feed/${id}`);
  };

  const handleModalOpen = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    fetchData(); // Refresh the table data after creation
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearchQuery = shipment.vessel_specifications?.vessel_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (filter === "Completed") {
      return matchesSearchQuery && shipment.current_status === "Completed";
    } else if (filter === "Current") {
      return matchesSearchQuery && shipment.current_status !== "Completed";
    } else {
      return matchesSearchQuery;
    }
  });

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

        const noActivity =
          (shipment_type?.cargo_operations?.cargo_operations_activity?.length ||
            0) === 0 &&
          (shipment_type?.bunkering?.bunkering_activity?.length || 0) === 0;

        if (noActivity) {
          return <Tag color="orange"> No Activity </Tag>;
        }

        if (cargoOperations && bunkering) {
          return (
            <>
              <Tag color="blue"> Cargo Operations </Tag>
              <Tag color="green"> Bunkering </Tag>
            </>
          );
        } else if (cargoOperations) {
          return <Tag color="blue"> Cargo Operations </Tag>;
        } else if (bunkering) {
          return <Tag color="green"> Bunkering </Tag>;
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
      render: (record: ShipmentResponse) => {
        return (
          <Button type="primary" onClick={() => handleView(record.ID)}>
            View
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
      <div className="search-bar-container">
        <Search
          placeholder="Search by Vessel Name"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-bar" // Apply the class to set width
        />
        <div>
          <Select
            defaultValue="All"
            style={{ width: 120, marginLeft: 10 }}
            onChange={handleFilterChange}
          >
            <Option value="All">All</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Current">Current</Option>
          </Select>
          <Button
            type="primary"
            onClick={handleModalOpen}
            style={{ marginLeft: 10 }}
          >
            Add Shipment
          </Button>
        </div>
      </div>
      <Card>
        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <Table dataSource={filteredShipments} columns={columns} rowKey="ID" />
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
