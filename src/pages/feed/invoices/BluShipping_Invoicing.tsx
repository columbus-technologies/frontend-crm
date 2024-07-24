import React, { useState } from "react";
import { Layout, Card, Typography, Button, Row, Form } from "antd";
import { FilePdfOutlined, EditOutlined } from "@ant-design/icons";
import { createInvoice, editInvoice } from "../../../api";
import { InvoicePricing, ShipmentResponse } from "../../../types";
import BluShipping_InvoiceForm from "../../../components/forms/invoices/BluShipping_InvoiceForm";
import BluShipping_InvoicePDF from "../../../components/pdf/BluShipping_InvoicePDF";
import InvoiceImage from "../../../assets/bluShipping.png";
import { PDFDownloadLink } from "@react-pdf/renderer";

import "../../../styles/InvoicingPage.css";
import useInvoiceData from "../../../hooks/invoice/BluShipping_useInvoiceData";

const { Title } = Typography;

interface InvoicingProps {
  selectedShipment: ShipmentResponse;
}

const Invoicing: React.FC<InvoicingProps> = ({ selectedShipment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hasCurrentInvoice, setHasCurrentInvoice] = useState(false);
  const [displayPDF, setDisplayPDF] = useState(false);

  const [form] = Form.useForm();

  const {
    hasExistingInvoice,
    tenantInformation,
    invoiceData,
    terminalName,
    fetchInvoiceData,
  } = useInvoiceData(selectedShipment, form);

  const handleSaveInvoice = async () => {
    setIsEditing(!isEditing);

    try {
      const values = await form.validateFields();
      const stringValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, String(value)])
      );
      const payload: InvoicePricing = {
        tenant: tenantInformation || "",
        shipment_id: selectedShipment.ID,
        invoice_pricing_details: stringValues,
        created_at: invoiceData?.created_at || new Date().toISOString(),
      };
      if (hasExistingInvoice || hasCurrentInvoice) {
        await editInvoice(selectedShipment.ID, payload);
        console.log("invoice edited successfully");
      } else {
        await createInvoice(payload);

        console.log("invoice saved successfully");
      }
      setIsEditing(false);
      await fetchInvoiceData(); // Re-fetch data after saving
      setHasCurrentInvoice(true);
      setDisplayPDF(true);
    } catch (error) {
      console.error("Failed to save or edit invoice", error);
    }
  };

  const handleEditPDA = () => {
    setIsEditing(true);
  };

  const calculateUnitsWithUnitPrice = (units: number, unitPrice: number) => {
    return units * unitPrice;
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    let newPortDues = allValues.port_dues_price || 0;
    let newPilotage = allValues.pilotage_price || 0;
    let newServiceLaunch = allValues.service_launch_price || 0;
    let newTowage = allValues.towage_price || 0;
    const mooringPrice = allValues.mooring_price || 0;
    let agencyFeePrice = allValues.agency_fee_price || 0;

    if (
      changedValues.port_dues_units !== undefined ||
      changedValues.port_dues_unitPrice !== undefined
    ) {
      newPortDues = calculateUnitsWithUnitPrice(
        allValues.port_dues_units || 0,
        allValues.port_dues_unitPrice || 0
      );
      form.setFieldsValue({
        port_dues_price: newPortDues,
        port_dues_remarks: `Basis ${
          allValues.port_dues_units
        } Units @ ${allValues.port_dues_unitPrice?.toFixed(2)} Per Unit`,
      });
    }

    if (
      changedValues.pilotage_hours !== undefined ||
      changedValues.pilotage_hourlyRate !== undefined
    ) {
      newPilotage = calculateUnitsWithUnitPrice(
        allValues.pilotage_hours || 0,
        allValues.pilotage_hourlyRate || 0
      );
      form.setFieldsValue({
        pilotage_price: newPilotage,
        pilotage_remarks: `Basis ${
          allValues.pilotage_hours
        } Hours @ ${allValues.pilotage_hourlyRate?.toFixed(2)} Per Hour`,
      });
    }

    if (
      changedValues.service_launch_trips !== undefined ||
      changedValues.service_launch_hourlyRate !== undefined
    ) {
      newServiceLaunch = calculateUnitsWithUnitPrice(
        allValues.service_launch_trips || 0,
        allValues.service_launch_hourlyRate || 0
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
      newTowage =
        (allValues.towage_tugRate || 0) *
        (allValues.towage_tugs || 0) *
        (allValues.towage_hours || 0) *
        ((allValues.towage_bafRate || 0) / 100 + 1);
      form.setFieldsValue({
        towage_price: newTowage,
        towage_remarks: `Estimated Basis SGD ${allValues.towage_tugRate}/Tug/Hr x ${allValues.towage_tugs} Tugs
        x ${allValues.towage_hours} Hrs + ${allValues.towage_bafRate} % BAF`,
      });
    }

    if (changedValues.agency_fee_price !== undefined) {
      agencyFeePrice = allValues.agency_fee_price || 0;
      form.setFieldsValue({
        agency_fee_price: agencyFeePrice,
      });
    }

    // Calculate the estimated total
    const estimatedTotal =
      newPortDues +
      newPilotage +
      newServiceLaunch +
      newTowage +
      mooringPrice +
      agencyFeePrice;
    console.log(
      newPortDues,
      newPilotage,
      newServiceLaunch,
      newTowage,
      mooringPrice,
      agencyFeePrice
    );
    form.setFieldsValue({
      estimated_total: estimatedTotal,
    });
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
            {(invoiceData || displayPDF) && (
              <PDFDownloadLink
                document={
                  <BluShipping_InvoicePDF
                    selectedShipment={selectedShipment}
                    invoicePricing={invoiceData!}
                  />
                }
                fileName={`VESSEL_PDA_ETA-ETD_VOY_CARGO OPS (${terminalName.toUpperCase()}).pdf`}
              >
                {({ loading }) =>
                  loading ? (
                    "Loading document..."
                  ) : (
                    <Button type="primary" icon={<FilePdfOutlined />}>
                      Export as PDF
                    </Button>
                  )
                }
              </PDFDownloadLink>
            )}
          </div>
        </Row>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <img src={InvoiceImage} alt="Company Logo" />
          </div>
          <BluShipping_InvoiceForm
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
