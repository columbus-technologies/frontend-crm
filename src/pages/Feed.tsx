import React, { useEffect, useState, useRef } from "react";
import { Card, Typography, Tabs, Button, Steps } from "antd";
import { useParams } from "react-router-dom";
import * as xml2js from "xml2js";

const { Title } = Typography;
const { TabPane } = Tabs;

import {
  CustomerResponse,
  ChecklistResponse,
  ShipmentResponse,
} from "../types";
import { FeedEmailResponse } from "../types/feed";
import {
  getChecklistById,
  getInvoiceTenant,
  getShipmentById,
  getShipmentStatuses,
} from "../api";
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
import RenderChecklistDetails from "./feed/ChecklistDetails";

const { Step } = Steps;

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
  const [shipmentStatuses, setShipmentStatuses] = useState<string[] | null>(
    null
  );
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);
  const { id } = useParams<{ id: string }>();
  const [invoiceTenant, setInvoiceTenant] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [preArrivalInformation, setPreArrivalInformation] = useState(null);

  // Ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async (id: string) => {
    try {
      const shipmentStatuses = await getShipmentStatuses();
      setShipmentStatuses(shipmentStatuses);

      const data = await getShipmentById(id);
      setSelectedShipment(data);

      const emails = await getFeedEmailsByShipmentID(id);
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
        setErrorMessage(error.message);
      } else {
        setErrorMessage(String(error));
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchData(id);
    } else {
      setErrorMessage("No shipment ID provided");
    }
  }, [id]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const xml = e.target.result;

        xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
          if (err) {
            console.error("Error parsing XML:", err);
            return;
          }
          const form = result.form;
          const newPreArrivalInformation = {
            voyage_number: form.name,
            current_ETA: `${form.date}T${form.time}Z`,
            shipment_type: {
              cargo_operations: {
                cargo_operations: true,
                cargo_operations_activity: form.Data[1].cargo.map((cargo) => ({
                  shipment_product: [
                    {
                      sub_product_type: cargo.typeofcargo,
                      quantity: parseInt(cargo.quantityofcargo, 10),
                    },
                  ],
                })),
              },
              bunkering: {
                bunkering: true,
                bunkering_activity: [
                  {
                    docking: form.alongside,
                    bunker_intake_specifications: form.Data[3].bunker.map(
                      (bunker) => ({
                        sub_product_type: bunker.bunkerprod,
                        maximum_quantity_intake: parseInt(
                          bunker.quantityintake,
                          10
                        ),
                        maximum_hose_size: parseInt(bunker.bunkersize, 10),
                      })
                    ),
                  },
                ],
              },
            },
            vessel_specifications: {
              vessel_name: "Super Ever",
              imo_number: 12345678,
            },
            shipment_details: {
              agent_details: {
                name: form.master,
                contact: form.lport,
              },
            },
          };

          setPreArrivalInformation(newPreArrivalInformation);
        });
      };
      reader.readAsText(file);
    }
  };

  const renderContent = (content: string) => (
    <div>
      <p>{content}</p>
    </div>
  );

  const handleCompleteShipmentClick = () => {
    setIsModalVisible(true);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const currentStatus = selectedShipment?.current_status || "Not Started";
  const currentIndex = shipmentStatuses?.findIndex(
    (status) => status === currentStatus
  );

  return (
    <div className="settings-management-container">
      {/* Flex container for Title and Upload XML button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Title level={2}>Shipment Overview</Title>
        <div>
          <Button onClick={handleUploadClick}>Upload XML</Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xml"
            onChange={handleFileUpload}
            style={{ display: "none" }} // Hide input
          />
        </div>
      </div>

      {/* Parsed Payload Section */}
      {preArrivalInformation && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Parsed Payload:</h3>
          <pre>{JSON.stringify(preArrivalInformation, null, 2)}</pre>
        </div>
      )}

      {/* Main Container for Cards */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <Card style={{ width: "80%" }}>
          {errorMessage ? (
            <p>{errorMessage}</p>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Feed" key="1">
                    <FeedDetails selectedFeedEmails={selectedFeedEmails} />
                  </TabPane>
                  <TabPane tab="Shipment Details" key="2">
                    <RenderShipmentDetails
                      selectedShipment={selectedShipment}
                    />
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
                    <RenderChecklistDetails
                      selectedShipment={selectedShipment!}
                      selectedChecklist={selectedChecklist}
                    />
                  </TabPane>
                  <TabPane tab="Invoicing" key="7">
                    {invoiceTenant === "BluShipping" && selectedShipment && (
                      <BluShippingInvoicing
                        selectedShipment={selectedShipment}
                      />
                    )}
                    {invoiceTenant === "columbusTest" && selectedShipment && (
                      <TestDemoInvoicing selectedShipment={selectedShipment} />
                    )}
                    {invoiceTenant === "customerA" && selectedShipment && (
                      <TestDemoInvoicing selectedShipment={selectedShipment} />
                    )}
                  </TabPane>
                </Tabs>
              </div>
            </>
          )}
        </Card>

        <Card style={{ width: "18%" }}>
          {selectedShipment ? (
            <>
              <Button type="primary" onClick={handleCompleteShipmentClick}>
                Complete Shipment
              </Button>
              <Steps
                direction="vertical"
                current={currentIndex}
                progressDot={(dot, { index }) => (
                  <span
                    className={
                      currentIndex !== undefined
                        ? index < currentIndex
                          ? "dot-finished"
                          : index === currentIndex
                          ? "dot-active"
                          : "dot-wait"
                        : "dot-wait"
                    }
                  >
                    {dot}
                  </span>
                )}
                style={{ marginTop: "30px" }}
              >
                {shipmentStatuses?.map((status, index) => (
                  <Step
                    key={index}
                    title={status}
                    status={
                      currentIndex !== undefined
                        ? index < currentIndex
                          ? "finish"
                          : index === currentIndex
                          ? "process"
                          : "wait"
                        : "wait"
                    }
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
