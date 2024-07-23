import React, { useState } from "react";
import { Layout, Card, Typography, Button, Row, Col, Form } from "antd";
import { FilePdfOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { createInvoice, editInvoice } from "../../api";
import { InvoicePricing, ShipmentResponse } from "../../types";
import InvoiceForm from "../../components/forms/InvoiceForm";

import InvoiceImage from "../../assets/bluShipping.png"; // Import the image

import "../../styles/InvoicingPage.css";
import useInvoiceData from "../../hooks/useInvoiceData";

const { Title } = Typography;

interface InvoicingProps {
  selectedShipment: ShipmentResponse;
}

const Invoicing: React.FC<InvoicingProps> = ({ selectedShipment }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [hasCurrentInvoice, setHasCurrentInvoice] = useState(false);

  const [form] = Form.useForm();
  const { hasExistingInvoice, tenantInformation, invoiceData } = useInvoiceData(
    selectedShipment,
    form
  );

  const handleSaveInvoice = async () => {
    setIsEditing(!isEditing);

    try {
      const values = await form.validateFields();
      const stringValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, String(value)])
      );
      console.log(stringValues, "string");
      const payload: InvoicePricing = {
        tenant: tenantInformation || "",
        shipment_id: selectedShipment.ID,
        invoice_pricing_details: stringValues,
        created_at: invoiceData?.created_at || new Date().toISOString(), // Use a default value if created_at is undefined
      };
      console.log(hasExistingInvoice, "hasexisting");
      if (hasExistingInvoice || hasCurrentInvoice) {
        await editInvoice(selectedShipment.ID, payload);
        console.log("Invoice edited successfully");
      } else {
        await createInvoice(payload);
        console.log("Invoice saved successfully");
        setHasCurrentInvoice(true);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save or edit invoice", error);
    }
  };

  const handleEditPDA = () => {
    setIsEditing(true);
  };

  const handleExportPDF = () => {
    // Logic to handle exporting as PDF
    console.log("Export as PDF clicked");
  };

  const calculateUnitsWithUnitPrice = (units: number, unitPrice: number) => {
    return units * unitPrice;
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    if (
      changedValues.port_dues_units !== undefined ||
      changedValues.port_dues_unitPrice !== undefined
    ) {
      const newPortDues = calculateUnitsWithUnitPrice(
        allValues.port_dues_units,
        allValues.port_dues_unitPrice
      );
      form.setFieldsValue({
        port_dues_price: newPortDues,
        port_dues_remarks: `Basis ${
          allValues.port_dues_units
        } Units @ ${allValues.port_dues_unitPrice.toFixed(2)} Per Unit`,
      });
    }

    if (
      changedValues.pilotage_hours !== undefined ||
      changedValues.pilotage_hourlyRate !== undefined
    ) {
      const newPilotage = calculateUnitsWithUnitPrice(
        allValues.pilotage_hours,
        allValues.pilotage_hourlyRate
      );
      form.setFieldsValue({
        pilotage_price: newPilotage,
        pilotage_remarks: `Basis ${
          allValues.pilotage_hours
        } Hours @ ${allValues.pilotage_hourlyRate.toFixed(2)} Per Hour`,
      });
    }

    if (
      changedValues.service_launch_trips !== undefined ||
      changedValues.service_launch_hourlyRate !== undefined
    ) {
      const newServiceLaunch = calculateUnitsWithUnitPrice(
        allValues.service_launch_trips,
        allValues.service_launch_hourlyRate
      );
      form.setFieldsValue({
        service_launch_price: newServiceLaunch,
        service_launch_remarks: `Estimated Basis ${allValues.service_launch_trips} Trips`,
      });
    }

    if (
      changedValues.towage_tugRate !== undefined ||
      changedValues.towage_tugs !== undefined ||
      changedValues.towage_hours !== undefined ||
      changedValues.towage_bafRate !== undefined ||
      changedValues.towage_price !== undefined
    ) {
      const newTowage =
        allValues.towage_tugRate *
        allValues.towage_tugs *
        allValues.towage_hours *
        (allValues.towage_bafRate / 100 + 1);
      form.setFieldsValue({
        towage_price: newTowage,
        towage_remarks: `Estimated Basis SGD ${allValues.towage_tugRate}/Tug/Hr x ${allValues.towage_tugs} Tugs
        x ${allValues.towage_hours} Hrs + ${allValues.towage_bafRate} % BAF`,
      });
    }

    if (changedValues.agency_fee_price !== undefined) {
      form.setFieldsValue({
        agency_fee_price: allValues.agency_fee_price,
      });
    }
  };

  return (
    <Layout>
      <Card>
        <Row justify="space-between" style={{ marginBottom: "20px" }}>
          <Title level={2}>Invoicing</Title>
          <div>
            {isEditing ? (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleSaveInvoice}
                style={{ marginRight: "10px" }}
              >
                Save
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEditPDA}
                style={{ marginRight: "10px" }}
              >
                Edit PDA
              </Button>
            )}
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              onClick={handleExportPDF}
            >
              Export as PDF
            </Button>
          </div>
        </Row>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px", // Set a height to the container for vertical centering
            }}
          >
            <img src={InvoiceImage} alt="Company Logo" />
          </div>
          <InvoiceForm
            form={form}
            selectedShipment={selectedShipment}
            isEditing={isEditing}
            onValuesChange={onValuesChange}
          />
        </Card>
      </Card>
    </Layout>
  );
};

export default Invoicing;
