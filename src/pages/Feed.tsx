import React, { useEffect, useState } from "react";
import { Card, Typography, Tabs, Button, Steps } from "antd";
import { useParams } from "react-router-dom"; // Import useParams

const { Title } = Typography;
const { TabPane } = Tabs;

import {
  CustomerResponse,
  ChecklistResponse,
  ShipmentResponse,
} from "../types";
import { FeedEmailResponse } from "../types/feed";
import { getChecklistById, getInvoiceTenant, getShipmentById, getShipmentStatuses } from "../api"; // Remove getAllShipments import
import { getFeedEmailsByShipmentID } from "../api/feed_emails";
import UnauthorizedModal from "../components/modals/UnauthorizedModal";
import CompleteShipmentModal from "../components/modals/CompleteShipmentModal";
import RenderShipmentDetails from "./feed/ShipmentDetails";
import BluShippingInvoicing from "./feed/invoices/BluShipping_Invoicing";
import TestDemoInvoicing from "./feed/invoices/TestDemo_Invoicing";
import FeedDetails from "./feed/FeedDetails";

import RenderVesselDetails from "./feed/VesselDetails";
import fetchCustomerDataByShipment from "../utils/customer";
import renderCustomerDetails from "./feed/CustomerDetails";
import Enum from "../utils/enum";
import RenderChecklistDetails from "./feed/ChecklistDetails";

const { Step } = Steps;
const shipmentStatuses = await getShipmentStatuses();

const Feed: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedShipment, setSelectedShipment] =
    useState<ShipmentResponse | null>(null);
  const [selectedChecklist, setSelectedChecklist] =
    useState<ChecklistResponse | null>(null);
  const [selectedFeedEmails, setSelectedFeedEmails] =
    useState<FeedEmailResponse | null>(null);
  const [customerData, setCustomerData] = useState<CustomerResponse[] | null>(
    null
  );
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL
  const [invoiceTenant, setInvoiceTenant] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

      const checklistData = await getChecklistById(id);
      setSelectedChecklist(checklistData);

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

  const handleCompleteShipmentClick = () => {
    if (selectedShipment) {
      selectedShipment.current_status = Enum.COMPLETED_STATUS;
    }
    setIsModalVisible(true);
  };

  const currentStatus = selectedShipment?.current_status || "Not Started";
  const currentIndex = shipmentStatuses.findIndex(status => status === currentStatus);

  return (
    <div className="settings-management-container">
      <Title level={2}>Shipment Overview</Title>

      {/* Flexbox container to hold the two cards side by side */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Card style={{ width: "70%" }}>
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
                <RenderVesselDetails selectedShipment={selectedShipment!} />
              </TabPane>
              <TabPane tab="Customer" key="4">
                {renderCustomerDetails(customerData)}
              </TabPane>
              <TabPane tab="Audit" key="5">
                {renderContent("Audit content...")}
              </TabPane>
              <TabPane tab="Checklist" key="6">
                {/* {renderContent("Checklist content...")} */}
                <RenderChecklistDetails
                  selectedShipment={selectedShipment!}
                  selectedChecklist={selectedChecklist}
                  // selectedInvoice={invoiceData}
                />
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

        <Card style={{ width: "30%" }}>
          {selectedShipment ? (
            <>
              <Button type="primary" onClick={handleCompleteShipmentClick}>
                Complete Shipment
              </Button>

              {/* Vertical steps with dots for the shipment status timeline */}
              <Steps
                direction="vertical"
                current={currentIndex} // Highlight the current step
                progressDot={(dot, { index }) => (
                  <span
                    className={index < currentIndex ? 'dot-finished' : index === currentIndex ? 'dot-active' : 'dot-wait'}
                  >
                    {dot}
                  </span>
                )}
                style={{ marginTop: "20px" }}
              >
                {shipmentStatuses.map((status, index) => (
                  <Step
                    key={index}
                    title={status}
                    status={index < currentIndex ? 'finish' : index === currentIndex ? 'process' : 'wait'}
                  />
                ))}
              </Steps>
            </>
          ) : (
            <p>No shipment selected</p>
          )}
        </Card>
      </div>

      {isModalVisible && selectedShipment && (
        <CompleteShipmentModal
          shipmentId={selectedShipment.ID}
          selectedShipment={selectedShipment}
          onSuccess={() => {
            setIsModalVisible(false);
            fetchData(selectedShipment.ID);
          }}
          onCancel={() => setIsModalVisible(false)}
        />
      )}

      <UnauthorizedModal
        visible={isUnauthorizedModalVisible}
        onClose={() => setIsUnauthorizedModalVisible(false)}
      />
    </div>
  );
};

export default Feed;
