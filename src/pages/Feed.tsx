import React, { useEffect, useState } from "react";
import { Card, Typography, Tabs } from "antd";
import { useParams } from "react-router-dom"; // Import useParams

const { Title } = Typography;
const { TabPane } = Tabs;

import { CustomerResponse, ShipmentResponse } from "../types";
import { FeedEmailResponse } from "../types/feed";
import { getInvoiceTenant, getShipmentById } from "../api"; // Remove getAllShipments import
import { getFeedEmailsByShipmentID } from "../api/feed_emails";
import UnauthorizedModal from "../components/modals/UnauthorizedModal";
import RenderShipmentDetails from "./feed/ShipmentDetails";
import BluShippingInvoicing from "./feed/invoices/BluShipping_Invoicing";
import TestDemoInvoicing from "./feed/invoices/TestDemo_Invoicing";
import FeedDetails from "./feed/FeedDetails";

import RenderVesselDetails from "./feed/VesselDetails";
import fetchCustomerDataByShipment from "../utils/customer";
import renderCustomerDetails from "./feed/CustomerDetails";

const Feed: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedShipment, setSelectedShipment] =
    useState<ShipmentResponse | null>(null);
  const [selectedFeedEmails, setSelectedFeedEmails] =
    useState<FeedEmailResponse | null>(null);
  const [customerData, setCustomerData] = useState<CustomerResponse[] | null>(
    null
  );
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL
  const [invoiceTenant, setInvoiceTenant] = useState<string | null>(null);

  const fetchData = async (id: string) => {
    try {
      const data = await getShipmentById(id);
      console.log("Fetched shipment:", data); // Debugging statement
      setSelectedShipment(data);

      const emails = await getFeedEmailsByShipmentID(id);
      console.log("Fetched feed emails:", emails); // Debugging statement
      setSelectedFeedEmails(emails);

      const fetchedShipment = await fetchCustomerDataByShipment(data);
      setCustomerData(fetchedShipment);

      const fetchedTenant = await getInvoiceTenant();
      setInvoiceTenant(fetchedTenant.tenant);

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
    if (id) {
      fetchData(id);
    } else {
      setErrorMessage("No shipment ID provided");
    }
  }, [id]); // Dependency array now includes id

  const renderContent = (content: string) => (
    <div>
      <p>{content}</p>
    </div>
  );

  return (
    <div className="settings-management-container">
      <Title level={2}>Shipment Overview</Title>
      <Card>
        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <Tabs defaultActiveKey="1">
            <TabPane tab="Feed" key="1">
              <FeedDetails selectedFeedEmails={selectedFeedEmails} />
            </TabPane>
            <TabPane tab="Shipment Details" key="2">
              <RenderShipmentDetails selectedShipment={selectedShipment} />
            </TabPane>
            <TabPane tab="Vessel" key="3">
              <RenderVesselDetails selectedShipment={selectedShipment} />
            </TabPane>
            <TabPane tab="Customer" key="4">
              {renderCustomerDetails(customerData)}
            </TabPane>
            <TabPane tab="Audit" key="5">
              {renderContent("Audit content...")}
            </TabPane>
            <TabPane tab="Documents" key="6">
              {renderContent("Documents content...")}
            </TabPane>
            <TabPane tab="Invoicing" key="7">
              {invoiceTenant === "BluShipping" && selectedShipment && (
                <BluShippingInvoicing selectedShipment={selectedShipment} />
              )}
              {invoiceTenant === "columbusTest" && selectedShipment && (
                <TestDemoInvoicing selectedShipment={selectedShipment} />
              )}
              {invoiceTenant === "customerA" && selectedShipment && (
                <TestDemoInvoicing selectedShipment={selectedShipment} />
              )}
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
