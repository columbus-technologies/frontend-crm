import React, { useEffect, useState } from "react";
import { Card, Typography, Tabs } from "antd";
import { useParams } from "react-router-dom"; // Import useParams

const { Title } = Typography;
const { TabPane } = Tabs;

import { ShipmentResponse } from "../types";
import { getShipmentById } from "../api"; // Remove getAllShipments import
import UnauthorizedModal from "../components/modals/UnauthorizedModal";
import { renderShipmentDetails } from "./feed/ShipmentDetails";

const Feed: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedShipment, setSelectedShipment] =
    useState<ShipmentResponse | null>(null);
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL

  const fetchData = async () => {
    try {
      const data = await getShipmentById(id);
      console.log("Fetched shipment:", data); // Debugging statement
      setSelectedShipment(data);
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
    fetchData();
  }, [id]); // Dependency array now includes id

  const renderContent = (content: string) => (
    <div>
      <p>{content}</p>
    </div>
  );

  return (
    <div className="settings-management-container">
      <Title level={2}>Feed</Title>
      <Card>
        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <Tabs defaultActiveKey="1">
            <TabPane tab="Feed" key="1">
              {renderContent("Feed content...")}
            </TabPane>
            <TabPane tab="Shipment Details" key="2">
              {renderShipmentDetails(selectedShipment)}
            </TabPane>
            <TabPane tab="Vessel" key="3">
              {renderContent("Vessel content...")}
            </TabPane>
            <TabPane tab="Customer" key="4">
              {renderContent("Customer content...")}
            </TabPane>
            <TabPane tab="Audit" key="5">
              {renderContent("Audit content...")}
            </TabPane>
            <TabPane tab="Documents" key="6">
              {renderContent("Documents content...")}
            </TabPane>
            <TabPane tab="Accounting" key="7">
              {renderContent("Accounting content...")}
            </TabPane>
          </Tabs>
        )}
      </Card>
      <UnauthorizedModal
        visible={isUnauthorizedModalVisible}
        onClose={() => setIsUnauthorizedModalVisible(false)}
      />
    </div>
  );
};

export default Feed;
