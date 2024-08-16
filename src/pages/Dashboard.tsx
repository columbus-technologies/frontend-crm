import React, { useEffect, useState } from "react";
import { Typography, Row, Col, Card, Image, Select, Spin } from "antd";
import "../styles/index.css"; // Ensure the CSS file is imported
import "../styles/DashboardHorizontalScroll.css";
import "../styles/Quicklinks.css";

import { ShipmentResponse } from "../types";
import { getAllShipments, getShipmentStatuses } from "../api";
import UnauthorizedModal from "../components/modals/UnauthorizedModal";
import ShipmentCard from "../components/cards/ShipmentCard";
import VisaImage from "../assets/mpa.jpg";
import DigiPortImage from "../assets/digitalport-logo.png";
import WeatherImage from "../assets/sea.jpeg";
import PilotageImage from "../assets/mpa.jpg";

const { Title, Text } = Typography;
const { Option } = Select;

const Dashboard: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shipments, setShipments] = useState<ShipmentResponse[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<
    ShipmentResponse[]
  >([]);
  const [shipmentStatuses, setShipmentStatuses] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const data = await getAllShipments();
        console.log(data);
        setShipments(data);
        setFilteredShipments(data);

        const shipmentStatusesData = await getShipmentStatuses();
        console.log(shipmentStatusesData);
        setShipmentStatuses(["All", ...shipmentStatusesData]);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Unauthorized") {
            setIsUnauthorizedModalVisible(true);
          }
          setErrorMessage(error.message);
          console.log(errorMessage);
        } else {
          setErrorMessage(String(error));
        }
        console.error("There was an error!", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData(); // Initial fetch
  }, []);

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    if (value === "All") {
      setFilteredShipments(shipments);
    } else {
      const filtered = shipments.filter(
        (shipment) => shipment.current_status === value
      );
      setFilteredShipments(filtered);
    }
  };

  // Example quicklinks with background images and titles
  const quicklinks = [
    {
      title: "Visa Application",
      url: "https://example.com/visa",
      imageUrl: VisaImage, // Use the imported image
    },
    {
      title: "MPA DigitalPORT",
      url: "https://digitalport.mpa.gov.sg",
      imageUrl: DigiPortImage, // Use the imported image
    },
    {
      title: "Weather",
      url: "https://example.com/weather",
      imageUrl: WeatherImage, // Use the imported image
    },
    {
      title: "PSA Pilotage Service",
      url: "https://example.com/psa",
      imageUrl: PilotageImage, // Use the imported image
    },
  ];

  return (
    <div className="settings-management-container">
      <UnauthorizedModal
        visible={isUnauthorizedModalVisible}
        onClose={() => setIsUnauthorizedModalVisible(false)}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={2}>Ongoing Shipments</Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Text style={{ marginRight: 8 }}>Filter:</Text>
          <Select
            style={{ width: 200 }}
            placeholder="Filter by Status"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            {shipmentStatuses.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spin size="large" />
        </div>
      ) : filteredShipments && filteredShipments.length > 0 ? (
        <>
          <div className="horizontal-scroll-container">
            {filteredShipments.map((shipment) => {
              console.log(
                `Shipment ${shipment.ID} has ${shipment.shipment_type.cargo_operations.cargo_operations_activity.length} activities`
              );
              return (
                <Col
                  className="shipment-card-wrapper"
                  span={8}
                  key={shipment.ID}
                >
                  <ShipmentCard shipment={shipment} />
                </Col>
              );
            })}
          </div>
          <Row gutter={[16, 16]} className="quicklinks-row">
            {quicklinks.map((link, index) => (
              <Col span={12} key={index}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <Card
                    className="quicklink-card"
                    hoverable
                    cover={
                      <Image
                        src={link.imageUrl}
                        alt={link.title}
                        preview={false}
                      />
                    }
                  >
                    <div className="quicklink-text">{link.title}</div>
                  </Card>
                </a>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <p>No ongoing shipments available.</p>
      )}
    </div>
  );
};

export default Dashboard;
