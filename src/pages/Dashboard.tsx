import React, { useEffect, useState } from "react";
import { Typography, Row, Col, Card, Image } from "antd";
// import { useNavigate } from "react-router-dom";
import "../styles/index.css"; // Ensure the CSS file is imported
import "../styles/DashboardHorizontalScroll.css";
import "../styles/Quicklinks.css";

import { ShipmentResponse } from "../types";
import { getAllShipments } from "../api";
import UnauthorizedModal from "../components/modals/UnauthorizedModal";
import ShipmentCard from "../components/cards/ShipmentCard";
import VisaImage from "../assets/mpa.jpg";
import DigiPortImage from "../assets/mpa.jpg";
import WeatherImage from "../assets/mpa.jpg";
import PilotageImage from "../assets/mpa.jpg";

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shipments, setShipments] = useState<ShipmentResponse[]>([]);
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllShipments();
        console.log(data);
        setShipments(data);
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
      }
    };

    fetchData(); // Initial fetch
  }, []);

  // Example quicklinks with background images and titles
  const quicklinks = [
    {
      title: "Visa Application",
      url: "https://example.com/visa",
      imageUrl: VisaImage, // Use the imported image
    },
    {
      title: "MPA DigitalPORT",
      url: "https://example.com/mpa",
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
      <Title level={2}>Ongoing Shipments</Title>
      {shipments && shipments.length > 0 ? (
        <>
          <div className="horizontal-scroll-container">
            {shipments.map((shipment) => {
              console.log(
                `Shipment ${shipment.ID} has ${shipment.shipment_type.cargo_operations.cargo_operations_activity.length} activities`
              );
              return (
                <div className="shipment-card-wrapper" key={shipment.ID}>
                  <ShipmentCard shipment={shipment} />
                </div>
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
