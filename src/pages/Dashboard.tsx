import React, { useEffect, useState } from "react";
import { Typography, Row, Col } from "antd";
// import { useNavigate } from "react-router-dom";
import "../styles/index.css"; // Ensure the CSS file is imported
import { ShipmentResponse } from "../types";
import { getAllShipments } from "../api";
import UnauthorizedModal from "../components/modals/UnauthorizedModal";
import ShipmentCard from "../components/cards/ShipmentCard";

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
        } else {
          setErrorMessage(String(error));
        }
        console.error("There was an error!", error);
      }
    };

    fetchData(); // Initial fetch
  }, []);

  return (
    <div className="settings-management-container">
      <UnauthorizedModal
        visible={isUnauthorizedModalVisible}
        onClose={() => setIsUnauthorizedModalVisible(false)}
      />
      <Title level={2}>Ongoing Shipments</Title>
      {shipments && shipments.length > 0 ? (
        <Row gutter={16}>
          {shipments.map((shipment) => {
            console.log(
              `Shipment ${shipment.ID} has ${shipment.shipment_type.cargo_operations.cargo_operations_activity.length} activities`
            );
            return (
              <Col span={8} key={shipment.ID}>
                <ShipmentCard shipment={shipment} />
              </Col>
            );
          })}
        </Row>
      ) : (
        <p>No ongoing shipments available.</p>
      )}
    </div>
  );
};

export default Dashboard;
